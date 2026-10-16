import assert from 'node:assert/strict'
import test from 'node:test'
import { translate } from '../src/i18n/translate.js'

test('mantém português e não altera texto desconhecido', () => {
    assert.equal(translate('Quem sou', 'pt-BR'), 'Quem sou')
    assert.equal(translate('Projeto pessoal sem tradução', 'en'), 'Projeto pessoal sem tradução')
    assert.equal(translate(null, 'en'), null)
})

test('traduz apresentação e rótulos dinâmicos sem perder dados', () => {
    assert.equal(translate('Quem sou', 'en'), 'About me')
    assert.equal(translate('Abrir notificações. 3 não lidas.', 'en'), 'Open notifications. 3 unread.')
    assert.equal(translate('Fechar Contato', 'en'), 'Close Contact')
    assert.equal(translate('Abrir GitHub em nova aba', 'en'), 'Open GitHub in a new tab')
    assert.equal(translate('Restaurar SnakePy', 'en'), 'Restore SnakePy')
})
