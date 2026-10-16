import english from './translations.js'

export function translate(text, language) {
    if (language !== 'en' || typeof text !== 'string') return text
    if (Object.hasOwn(english, text)) return english[text]
    const notification = text.match(/^(Abrir|Fechar) notificações\. (\d+) não lidas\.$/)
    if (notification) return (notification[1] === 'Abrir' ? 'Open' : 'Close') + ' notifications. ' + notification[2] + ' unread.'
    const duration = text.match(/^(\d+) horas?$/)
    if (duration) return duration[1] + (duration[1] === '1' ? ' hour' : ' hours')
    const actions = { Abrir: 'Open', Fechar: 'Close', Minimizar: 'Minimize', Maximizar: 'Maximize', Restaurar: 'Restore' }
    const action = text.match(/^(Abrir|Fechar|Minimizar|Maximizar|Restaurar) (.+)$/)
    if (action) {
        const remainder = action[2].replace(/ em nova aba$/, ' in a new tab')
        return actions[action[1]] + ' ' + (english[remainder] ?? remainder)
    }
    return text
}
