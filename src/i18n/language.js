import { useSyncExternalStore } from 'react'
import english from './translations'

const LANGUAGE_KEY = 'ws-os:language'
const listeners = new Set()
function readLanguage() {
    try {
        const stored = localStorage.getItem(LANGUAGE_KEY) ?? localStorage.getItem('ws-os:about-language')
        return stored === 'en' ? 'en' : 'pt-BR'
    } catch { return 'pt-BR' }
}
let currentLanguage = readLanguage()
if (typeof document !== 'undefined') document.documentElement.lang = currentLanguage

export function setLanguage(language) {
    if (language !== 'en' && language !== 'pt-BR') return
    currentLanguage = language
    document.documentElement.lang = language
    try { localStorage.setItem(LANGUAGE_KEY, language) } catch { /* Preferência válida nesta sessão. */ }
    listeners.forEach((listener) => listener())
}

function subscribe(listener) {
    listeners.add(listener)
    const onStorage = (event) => {
        if (event.key !== LANGUAGE_KEY && event.key !== null) return
        currentLanguage = readLanguage()
        document.documentElement.lang = currentLanguage
        listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
    }
}

export function useLanguage() {
    const language = useSyncExternalStore(subscribe, () => currentLanguage, () => 'pt-BR')
    const t = (text) => language === 'en' ? (english[text] ?? text) : text
    return { language, setLanguage, t }
}
