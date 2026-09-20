import {
    Check,
    Copy,
    ExternalLink,
    GitBranch,
    Link,
    Mail,
    MessageCircle,
} from 'lucide-react'

import {
    useEffect,
    useRef,
    useState,
} from 'react'

import './Contact.css'


/* === DADOS === */
const EMAIL =
    'warlleysilvax@gmail.com'


const contactLinks = [
    {
        label:
            'GitHub',

        value:
            'github.com/warlleyz',

        description:
            'Projetos, código e repositórios.',

        href:
            'https://github.com/warlleyz',

        icon:
            GitBranch,
    },

    {
        label:
            'LinkedIn',

        value:
            'linkedin.com/in/warlleysilvab',

        description:
            'Perfil profissional e conexões.',

        href:
            'https://www.linkedin.com/in/warlleysilvab/',

        icon:
            Link,
    },
]


function Contact() {

    /* === ESTADO === */
    const [
        copied,
        setCopied,
    ] = useState(false)

    const copyFeedbackTimer =
        useRef(null)


    /* === LIMPEZA === */
    useEffect(() => {
        return () => {
            if (
                copyFeedbackTimer.current
            ) {
                clearTimeout(
                    copyFeedbackTimer.current,
                )
            }
        }
    }, [])


    /* === FEEDBACK DE CÓPIA === */
    const showCopiedFeedback =
        () => {
            setCopied(
                true,
            )

            if (
                copyFeedbackTimer.current
            ) {
                clearTimeout(
                    copyFeedbackTimer.current,
                )
            }

            copyFeedbackTimer.current =
                setTimeout(
                    () => {
                        setCopied(
                            false,
                        )

                        copyFeedbackTimer.current =
                            null
                    },
                    1800,
                )
        }


    /* === COPIAR E-MAIL === */
    const copyEmailFallback =
        () => {
            const textarea =
                document.createElement(
                    'textarea',
                )

            textarea.value =
                EMAIL

            textarea.setAttribute(
                'readonly',
                '',
            )

            textarea.style.position =
                'fixed'

            textarea.style.opacity =
                '0'

            textarea.style.pointerEvents =
                'none'

            document.body.appendChild(
                textarea,
            )

            textarea.select()

            document.execCommand(
                'copy',
            )

            document.body.removeChild(
                textarea,
            )
        }


    const copyEmail =
        async () => {
            try {
                if (
                    navigator.clipboard &&
                    window.isSecureContext
                ) {
                    await navigator
                        .clipboard
                        .writeText(
                            EMAIL,
                        )
                } else {
                    copyEmailFallback()
                }

                showCopiedFeedback()
            } catch {
                try {
                    copyEmailFallback()

                    showCopiedFeedback()
                } catch {
                    setCopied(
                        false,
                    )
                }
            }
        }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="contact">

            {/* === APRESENTAÇÃO === */}
            <section className="contact-intro">
                <span className="contact-intro-icon">
                    <MessageCircle
                        size={19}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </span>

                <div className="contact-intro-content">
                    <div className="contact-intro-heading">
                        <strong>
                            Contato profissional
                        </strong>

                        <span className="contact-availability">
                            <span
                                className="contact-status"
                                aria-hidden="true"
                            />

                            Aberto a oportunidades
                        </span>
                    </div>

                    <p>
                        Entre em contato para conversar sobre
                        projetos, oportunidades ou desenvolvimento
                        de software.
                    </p>
                </div>
            </section>


            {/* === E-MAIL === */}
            <section className="contact-email">
                <span className="contact-email-icon">
                    <Mail
                        size={21}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </span>

                <div className="contact-email-content">
                    <span className="contact-type">
                        E-mail
                    </span>

                    <strong>
                        {EMAIL}
                    </strong>

                    <p>
                        Melhor canal para contato direto.
                    </p>
                </div>

                <button
                    className={[
                        'contact-copy-button',

                        copied
                            ? 'contact-copy-button-success'
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    type="button"
                    onClick={
                        copyEmail
                    }
                    aria-label={
                        copied
                            ? 'E-mail copiado'
                            : 'Copiar endereço de e-mail'
                    }
                >
                    {
                        copied
                            ? (
                                <>
                                    <Check
                                        size={15}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />

                                    Copiado
                                </>
                            )
                            : (
                                <>
                                    <Copy
                                        size={15}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />

                                    Copiar e-mail
                                </>
                            )
                    }
                </button>
            </section>


            {/* === REDES PROFISSIONAIS === */}
            <section className="contact-socials">
                {contactLinks.map(
                    (contact) => {
                        const Icon =
                            contact.icon

                        return (
                            <a
                                key={
                                    contact.label
                                }
                                className="contact-card"
                                href={
                                    contact.href
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={
                                    `Abrir ${contact.label} em nova aba`
                                }
                            >
                                <div className="contact-card-header">
                                    <span className="contact-card-icon">
                                        <Icon
                                            size={18}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <ExternalLink
                                        className="contact-external"
                                        size={14}
                                        strokeWidth={1.7}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="contact-card-content">
                                    <span className="contact-type">
                                        {
                                            contact.label
                                        }
                                    </span>

                                    <strong>
                                        {
                                            contact.value
                                        }
                                    </strong>

                                    <p>
                                        {
                                            contact.description
                                        }
                                    </p>
                                </div>
                            </a>
                        )
                    },
                )}
            </section>
        </div>
    )
}

export default Contact