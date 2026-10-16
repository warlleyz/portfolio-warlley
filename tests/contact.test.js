import assert from 'node:assert/strict'
import test from 'node:test'
import { isContactConfigured, sendContactMessage, validateContact } from '../src/services/contactService.js'

const config = { serviceId: 'test-service', templateId: 'test-template', publicKey: 'test-public-key' }
const fields = { name: 'Teste local', email: 'test@example.com', message: 'Mensagem de teste automatizado.', consent: true, website: '' }

test('valida campos, consentimento e honeypot', () => {
    assert.equal(validateContact(fields), null)
    for (const input of [{ ...fields, name: 'A' }, { ...fields, email: 'inválido' }, { ...fields, message: 'curta' }, { ...fields, consent: false }, { ...fields, website: 'spam' }]) assert.ok(validateContact(input))
})

test('sem configuração não consulta rede', async () => {
    assert.equal(isContactConfigured({}), false)
    await assert.rejects(sendContactMessage(fields, { config: {}, fetchImpl: () => assert.fail('Não deveria consultar rede') }), /configurado/)
})

test('envia apenas os parâmetros previstos e exige resposta de sucesso', async () => {
    const result = await sendContactMessage(fields, { config, fetchImpl: async (url, options) => {
        assert.equal(url, 'https://api.emailjs.com/api/v1.0/email/send')
        const body = JSON.parse(options.body)
        assert.deepEqual(body.template_params, { from_name: fields.name, from_email: fields.email, reply_to: fields.email, message: fields.message })
        assert.equal(body.user_id, config.publicKey)
        assert.equal('accessToken' in body, false)
        return new Response('OK', { status: 200 })
    } })
    assert.equal(result, true)
})

test('não apresenta sucesso em rejeição ou limite do provedor', async () => {
    await assert.rejects(sendContactMessage(fields, { config, fetchImpl: async () => new Response('erro', { status: 400 }) }), /não confirmou/)
    await assert.rejects(sendContactMessage(fields, { config, fetchImpl: async () => new Response('limite', { status: 429 }) }), /Muitas tentativas/)
})

test('timeout é envio não confirmado, sem repetição automática', async () => {
    let calls = 0
    await assert.rejects(sendContactMessage(fields, { config, timeoutMs: 5, fetchImpl: async (_, options) => {
        calls++
        return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Abort', 'AbortError')), { once: true }))
    } }), /não foi confirmado/)
    assert.equal(calls, 1)
})
