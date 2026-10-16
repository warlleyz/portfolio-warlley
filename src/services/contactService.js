const environment = import.meta.env ?? {}

export const contactConfiguration = {
    serviceId: environment.VITE_EMAILJS_SERVICE_ID ?? '',
    templateId: environment.VITE_EMAILJS_TEMPLATE_ID ?? '',
    publicKey: environment.VITE_EMAILJS_PUBLIC_KEY ?? '',
}

export function isContactConfigured(config = contactConfiguration) {
    return ['serviceId', 'templateId', 'publicKey'].every((key) => typeof config[key] === 'string' && config[key].trim().length > 0)
}

export function validateContact(fields) {
    if (!fields || typeof fields !== 'object') return 'Preencha os campos obrigatórios.'
    if (typeof fields.name !== 'string' || fields.name.trim().length < 2 || fields.name.length > 100) return 'Informe um nome entre 2 e 100 caracteres.'
    if (typeof fields.email !== 'string' || fields.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return 'Informe um e-mail válido.'
    if (typeof fields.message !== 'string' || fields.message.trim().length < 10 || fields.message.length > 5000) return 'Escreva uma mensagem entre 10 e 5000 caracteres.'
    if (fields.consent !== true) return 'Autorize o uso dos dados para responder à mensagem.'
    if (fields.website) return 'Não foi possível enviar a mensagem.'
    return null
}

export async function sendContactMessage(fields, { config = contactConfiguration, fetchImpl = fetch, signal, timeoutMs = 15000 } = {}) {
    const invalid = validateContact(fields)
    if (invalid) throw new Error(invalid)
    if (!isContactConfigured(config)) throw new Error('O formulário ainda não foi configurado. Use os canais de contato abaixo.')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    const cancel = () => controller.abort()
    if (signal?.aborted) controller.abort()
    signal?.addEventListener('abort', cancel, { once: true })
    try {
        const response = await fetchImpl('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                service_id: config.serviceId.trim(),
                template_id: config.templateId.trim(),
                user_id: config.publicKey.trim(),
                template_params: {
                    from_name: fields.name.trim(),
                    from_email: fields.email.trim(),
                    reply_to: fields.email.trim(),
                    message: fields.message.trim(),
                },
            }),
        })
        if (response.status === 429) throw new Error('Muitas tentativas. Aguarde um pouco antes de tentar novamente.')
        if (!response.ok) throw new Error('O serviço não confirmou o envio. Tente novamente ou use o e-mail direto.')
        return true
    } catch (error) {
        if (controller.signal.aborted) throw new Error('O envio não foi confirmado. Confira antes de reenviar para evitar duplicatas.', { cause: error })
        if (error instanceof TypeError) throw new Error('Falha de conexão. O envio não foi confirmado.', { cause: error })
        throw error
    } finally {
        clearTimeout(timeout)
        signal?.removeEventListener('abort', cancel)
    }
}
