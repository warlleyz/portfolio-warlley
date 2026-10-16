import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'

const source = fs.readFileSync(new URL('../src/data/searchData.js', import.meta.url), 'utf8')
    .replace(/^import[\s\S]*?from\s+['"][^'"]+['"]\s*/gm, '')
    .replace(/export const /g, 'const ')
const context = {
    appsData: [
        { id: 'about', name: 'Sobre mim', menu: true },
        { id: 'projects', name: 'Projetos', menu: true },
    ],
    projectsData: [{ id: 'test', title: 'API Clima', description: 'Projeto em Java', technologies: ['Java'] }],
    Code2: null,
}
vm.runInNewContext(source + '\nglobalThis.searchWS = searchWS', context)

test('busca não inclui todos os aplicativos quando não há correspondência', () => {
    assert.equal(context.searchWS('zzzzinexistente').length, 0)
    const results = context.searchWS('clima')
    assert.equal(results.length, 1)
    assert.equal(results[0].projectId, 'test')
})

test('busca reconhece nomes em inglês e acentos em português', () => {
    assert.equal(context.searchWS('about me')[0].appId, 'about')
    assert.equal(context.searchWS('APRESENTAÇÃO')[0].appId, 'about')
})
