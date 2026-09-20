import {
    Code2,
} from 'lucide-react'

import appsData from './appsData'
import projectsData from './projectsData'


/* === NORMALIZAÇÃO === */
export const normalizeSearchText = (
    value = '',
) => {
    return String(value)
        .normalize('NFD')
        .replace(
            /[\u0300-\u036f]/g,
            '',
        )
        .toLocaleLowerCase(
            'pt-BR',
        )
        .trim()
}


/* === PALAVRAS-CHAVE DOS APPS === */
const appKeywords = {
    about: [
        'sobre',
        'sobre mim',
        'warlley',
        'perfil',
        'apresentacao',
        'quem sou',
        'experiencia',
        'bio',
    ],

    projects: [
        'projetos',
        'portfolio',
        'codigo',
        'github',
        'repositorio',
        'desenvolvimento',
        'software',
    ],

    technologies: [
        'tecnologias',
        'tecnologia',
        'stack',
        'linguagens',
        'frameworks',
        'ferramentas',
        'java',
        'javascript',
        'typescript',
        'react',
        'vite',
        'html',
        'css',
        'spring',
        'spring boot',
        'node',
        'git',
        'github',
        'sql',
        'supabase',
    ],

    contact: [
        'contato',
        'email',
        'mensagem',
        'fale comigo',
        'linkedin',
        'social',
    ],

    resume: [
        'curriculo',
        'resume',
        'cv',
        'experiencia',
        'formacao',
        'educacao',
        'carreira',
    ],

    terminal: [
        'terminal',
        'console',
        'cmd',
        'comando',
        'linha de comando',
        'shell',
    ],

    stats: [
        'estatisticas',
        'stats',
        'dados',
        'github',
        'atividade',
    ],

    game: [
        'snake',
        'jogo',
        'game',
        'cobra',
        'diversao',
    ],
}


/* === UTILITÁRIOS === */
/* ----- TRANSFORMAR VALOR EM TEXTO ----- */
const valueToText = (
    value,
) => {
    if (
        value === null ||
        value === undefined
    ) {
        return ''
    }

    if (
        Array.isArray(value)
    ) {
        return value
            .map(valueToText)
            .join(' ')
    }

    if (
        typeof value === 'object'
    ) {
        return Object
            .values(value)
            .map(valueToText)
            .join(' ')
    }

    return String(value)
}


/* ----- TEXTO PESQUISÁVEL DO PROJETO ----- */
const getProjectSearchText = (
    project,
) => {
    const searchableValues = [
        project.title,
        project.name,
        project.description,
        project.summary,
        project.subtitle,
        project.category,
        project.type,
        project.status,
        project.technologies,
        project.technology,
        project.tech,
        project.stack,
        project.tags,
        project.languages,
        project.tools,
    ]

    return searchableValues
        .map(valueToText)
        .join(' ')
}


/* === ÍNDICE DOS APLICATIVOS === */
const appSearchItems =
    appsData
        .filter(
            (app) =>
                app.menu,
        )
        .map((app) => {
            const keywords =
                appKeywords[app.id] ?? []

            const searchableText = [
                app.name,
                ...keywords,
            ].join(' ')

            return {
                id:
                    `app-${app.id}`,

                type:
                    'app',

                appId:
                    app.id,

                title:
                    app.name,

                subtitle:
                    'Aplicativo',

                icon:
                    app.icon,

                keywords,

                searchText:
                    normalizeSearchText(
                        searchableText,
                    ),
            }
        })


/* === ÍNDICE DOS PROJETOS === */
const projectSearchItems =
    projectsData.map(
        (project) => ({
            id:
                `search-project-${project.id}`,

            type:
                'project',

            appId:
                `project-${project.id}`,

            projectId:
                project.id,

            title:
                project.title,

            subtitle:
                'Projeto',

            icon:
                project.icon,

            keywords:
                [],

            searchText:
                normalizeSearchText(
                    getProjectSearchText(
                        project,
                    ),
                ),
        }),
    )


/* === LINKS EXTERNOS === */
const githubKeywords = [
    'github',
    'git',
    'repositorios',
    'codigo',
    'warlleyz',
]

const externalSearchItems = [
    {
        id:
            'external-github',

        type:
            'external',

        title:
            'GitHub',

        subtitle:
            'Perfil externo',

        icon:
            Code2,

        href:
            'https://github.com/warlleyz',

        keywords:
            githubKeywords,

        searchText:
            normalizeSearchText(
                [
                    'GitHub',
                    ...githubKeywords,
                ].join(' '),
            ),
    },
]


/* === ÍNDICE COMPLETO === */
export const searchIndex = [
    ...appSearchItems,
    ...projectSearchItems,
    ...externalSearchItems,
]


/* === PONTUAÇÃO === */
const calculateSearchScore = (
    item,
    normalizedQuery,
) => {
    if (
        !normalizedQuery
    ) {
        return 0
    }

    const title =
        normalizeSearchText(
            item.title,
        )

    const searchText =
        item.searchText ?? ''

    let score = 0


    /* ----- NOME EXATO ----- */
    if (
        title === normalizedQuery
    ) {
        score += 100
    }


    /* ----- NOME COMEÇA COM BUSCA ----- */
    if (
        title.startsWith(
            normalizedQuery,
        )
    ) {
        score += 70
    }


    /* ----- NOME CONTÉM BUSCA ----- */
    if (
        title.includes(
            normalizedQuery,
        )
    ) {
        score += 50
    }


    /* ----- CONTEÚDO CONTÉM BUSCA ----- */
    if (
        searchText.includes(
            normalizedQuery,
        )
    ) {
        score += 30
    }


    /* ----- PALAVRAS INDIVIDUAIS ----- */
    const queryWords =
        normalizedQuery
            .split(/\s+/)
            .filter(Boolean)

    const matchedWords =
        queryWords.filter(
            (word) =>
                searchText.includes(
                    word,
                ),
        )

    score +=
        matchedWords.length * 10


    /* ----- PRIORIDADE DOS APPS ----- */
    if (
        item.type === 'app'
    ) {
        score += 3
    }

    return score
}


/* === BUSCA GLOBAL === */
export const searchWS = (
    query,
) => {
    const normalizedQuery =
        normalizeSearchText(
            query,
        )

    if (
        !normalizedQuery
    ) {
        return []
    }

    return searchIndex
        .map((item) => ({
            ...item,

            score:
                calculateSearchScore(
                    item,
                    normalizedQuery,
                ),
        }))
        .filter(
            (item) =>
                item.score > 0,
        )
        .sort(
            (first, second) =>
                second.score -
                first.score,
        )
}