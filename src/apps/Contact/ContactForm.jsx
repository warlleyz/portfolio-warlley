import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../i18n/language'
import { isContactConfigured, sendContactMessage, validateContact } from '../../services/contactService'

const initialFields = { name: '', email: '', message: '', consent: false, website: '' }

function ContactForm() {
    const { t } = useLanguage()
    const [fields, setFields] = useState(initialFields)
    const [busy, setBusy] = useState(false)
    const [feedback, setFeedback] = useState(null)
    const [confirmClose, setConfirmClose] = useState(false)
    const closeRequest = useRef(null)
    const dialogRef = useRef(null)
    const controller = useRef(null)
    const lastSent = useRef(0)
    const errorRef = useRef(null)
    const configured = isContactConfigured()
    const dirty = Boolean(fields.name || fields.email || fields.message)

    useEffect(() => () => controller.current?.abort(), [])
    useEffect(() => {
        if (!dirty) return
        const beforeUnload = (event) => { event.preventDefault(); event.returnValue = '' }
        const beforeClose = (event) => {
            if (event.detail?.appId !== 'contact') return
            event.preventDefault()
            closeRequest.current = event.detail.proceed
            setConfirmClose(true)
        }
        window.addEventListener('beforeunload', beforeUnload)
        window.addEventListener('ws-os:before-close', beforeClose)
        return () => {
            window.removeEventListener('beforeunload', beforeUnload)
            window.removeEventListener('ws-os:before-close', beforeClose)
        }
    }, [dirty])
    useEffect(() => {
        if (confirmClose) dialogRef.current?.showModal()
        else dialogRef.current?.close()
    }, [confirmClose])

    const change = (event) => {
        const { name, value, checked, type } = event.target
        setFields((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
        setFeedback(null)
    }
    const submit = async (event) => {
        event.preventDefault()
        if (controller.current || !configured) return
        const invalid = validateContact(fields)
        if (invalid || Date.now() - lastSent.current < 30000) {
            setFeedback({ error: true, text: invalid ?? 'Aguarde 30 segundos antes de enviar outra mensagem.' })
            errorRef.current?.focus()
            return
        }
        const request = new AbortController()
        controller.current = request
        setBusy(true)
        setFeedback(null)
        try {
            await sendContactMessage(fields, { signal: request.signal })
            if (request.signal.aborted) return
            lastSent.current = Date.now()
            setFields(initialFields)
            setFeedback({ error: false, text: 'Mensagem enviada ao serviço de e-mail. Obrigado pelo contato!' })
        } catch (error) {
            if (!request.signal.aborted) setFeedback({ error: true, text: error.message })
        } finally {
            if (controller.current === request) controller.current = null
            if (!request.signal.aborted) setBusy(false)
        }
    }

    return (
        <section className="contact-form-section" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title">{t('Envie uma mensagem')}</h2>
            <p>{t('Preencha os campos abaixo para entrar em contato por e-mail.')}</p>
            {!configured && <p className="contact-form-notice" id="contact-unconfigured">{t('O formulário ainda não foi configurado. Use os canais de contato abaixo.')}</p>}
            <dialog ref={dialogRef} className="contact-discard-dialog" aria-labelledby="contact-discard-title" onCancel={(event) => { event.preventDefault(); setConfirmClose(false) }}>
                <h2 id="contact-discard-title">{t('Descartar a mensagem não enviada?')}</h2>
                <p>{t('O texto será perdido ao fechar esta janela.')}</p>
                <div>
                    <button type="button" autoFocus onClick={() => setConfirmClose(false)}>{t('Continuar escrevendo')}</button>
                    <button type="button" onClick={() => { controller.current?.abort(); setConfirmClose(false); closeRequest.current?.() }}>{t('Descartar e fechar')}</button>
                </div>
            </dialog>
            <form onSubmit={submit} aria-describedby={!configured ? 'contact-unconfigured' : undefined}>
                <fieldset disabled={busy}>
                    <div className="contact-form-row">
                        <label htmlFor="contact-name">{t('Nome')}<input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={100} value={fields.name} onChange={change} /></label>
                        <label htmlFor="contact-email">{t('E-mail')}<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={fields.email} onChange={change} /></label>
                    </div>
                    <label htmlFor="contact-message">{t('Mensagem')}<textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} value={fields.message} onChange={change} /></label>
                    <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-website">Website<input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={change} /></label></div>
                    <label className="contact-consent"><input type="checkbox" name="consent" required checked={fields.consent} onChange={change} /><span>{t('Autorizo o uso do meu nome, e-mail e mensagem para responder ao contato.')}</span></label>
                    <p className="contact-form-privacy">{t('O envio utiliza EmailJS. O formulário não salva seus dados neste navegador.')}</p>
                    <button className="contact-submit" type="submit" disabled={!configured || busy}>{t(busy ? 'Enviando...' : 'Enviar mensagem')}</button>
                </fieldset>
                <div ref={errorRef} tabIndex={-1} role={feedback?.error ? 'alert' : 'status'} aria-live="polite" className={feedback?.error ? 'contact-feedback contact-feedback-error' : 'contact-feedback'}>{feedback ? t(feedback.text) : ''}</div>
            </form>
        </section>
    )
}

export default ContactForm
