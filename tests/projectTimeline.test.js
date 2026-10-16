import assert from 'node:assert/strict'
import test from 'node:test'
import { compareProjectsByCreation } from '../src/apps/Projects/projectTimeline.js'

test('ordena por criação crescente sem usar a data de atualização', () => {
    const projects = [
        { title: 'Recente', createdAt: '2026-09-10T20:57:16Z', updatedAt: '2026-09-11' },
        { title: 'Antigo', createdAt: '2026-05-27T19:43:49Z', updatedAt: '2026-10-15' },
        { title: 'Intermediário', createdAt: '2026-08-27T20:40:52Z' },
    ]
    const sorted = [...projects].sort(compareProjectsByCreation)
    assert.deepEqual(sorted.map((p) => p.title), ['Antigo', 'Intermediário', 'Recente'])
    assert.equal(projects[0].title, 'Recente')
})

test('mantém datas inválidas no fim e desempata por título', () => {
    const projects = [
        { title: 'Z', createdAt: null },
        { title: 'B', createdAt: '2026-08-27' },
        { title: 'A', createdAt: '2026-08-27' },
        { title: 'X', createdAt: 'inválida' },
    ]
    assert.deepEqual(projects.sort(compareProjectsByCreation).map((p) => p.title), ['A', 'B', 'X', 'Z'])
})
