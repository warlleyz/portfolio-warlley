import {
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    RotateCcw,
    Trash2,
} from 'lucide-react'

import appsData from '../../data/appsData'
import projectsData from '../../data/projectsData'

import Tooltip from '../../components/Tooltip/Tooltip'

import './Terminal.css'


/* === LINKS === */
const externalLinks = {
    github:
        'https://github.com/warlleyz',

    linkedin:
        'https://www.linkedin.com/in/warlleysilvab',

    email:
        'mailto:warlleysilvax@gmail.com',
}


/* === APLICATIVOS DO WS OS === */
const apps =
    Object.fromEntries(
        appsData.map(
            (
                app,
            ) => [
                    app.id,

                    {
                        name:
                            app.name,
                    },
                ],
        ),
    )


/* === PROJETOS === */
const projects =
    Object.fromEntries(
        projectsData.map(
            (
                project,
            ) => [
                    project.id,

                    {
                        id:
                            project.id,

                        name:
                            project.title,

                        repository:
                            project.repository,

                        technologies:
                            project.technologies
                                .join(', '),

                        description:
                            project.description ??
                            'Projeto disponível no GitHub.',

                        github:
                            `https://github.com/warlleyz/${project.repository}`,
                    },
                ],
        ),
    )


/* === SISTEMA DE ARQUIVOS SIMULADO === */
const fileSystem = {
    '~': {
        directories: [
            'portfolio',
        ],

        files: [],
    },

    '~/portfolio': {
        directories: [
            'about',
            'projects',
            'technologies',
            'contact',
            'resume',
            'stats',
        ],

        files: [
            'README.md',
        ],
    },

    '~/portfolio/about': {
        directories: [],

        files: [
            'profile.txt',
        ],
    },

    '~/portfolio/projects': {
        directories:
            projectsData.map(
                (
                    project,
                ) =>
                    project.id,
            ),

        files: [],
    },

    ...Object.fromEntries(
        projectsData.map(
            (
                project,
            ) => [
                    `~/portfolio/projects/${project.id}`,

                    {
                        directories: [],

                        files: [
                            'README.md',
                        ],
                    },
                ],
        ),
    ),

    '~/portfolio/technologies': {
        directories: [],

        files: [
            'stack.txt',
        ],
    },

    '~/portfolio/contact': {
        directories: [],

        files: [
            'contact.txt',
        ],
    },

    '~/portfolio/resume': {
        directories: [],

        files: [
            'curriculo-warlley.pdf',
        ],
    },

    '~/portfolio/stats': {
        directories: [],

        files: [
            'github.txt',
            'wakatime.txt',
        ],
    },
}


/* === CONTEÚDO DOS ARQUIVOS === */
const fileContents = {
    '~/portfolio/README.md':
        `WS OS Portfolio

Portfólio interativo desenvolvido para apresentar
projetos, tecnologias, experiência e atividade
de desenvolvimento de Warlley Silva Baião Braga.

Digite:
ls
cd projects
help`,

    '~/portfolio/about/profile.txt':
        `Warlley Silva Baião Braga

Estudante de Engenharia de Software na PUC Minas.

Áreas de interesse:
- Desenvolvimento de sistemas
- Desenvolvimento web
- APIs
- Automação
- Dados
- Inteligência Artificial`,

    '~/portfolio/technologies/stack.txt':
        `Linguagens:
Java
JavaScript
Python
PHP
HTML
CSS

Backend:
Spring Boot
APIs REST
Maven

Ferramentas:
Git
GitHub
Docker
Postman

Design e dados:
Figma
Power BI
Banco de Dados`,

    '~/portfolio/contact/contact.txt':
        `E-mail:
warlleysilvax@gmail.com

GitHub:
github.com/warlleyz

LinkedIn:
linkedin.com/in/warlleysilvab`,

    '~/portfolio/stats/github.txt':
        `Os dados do GitHub são carregados
dinamicamente pelo aplicativo Estatísticas.

Digite:

open stats`,

    '~/portfolio/stats/wakatime.txt':
        `Os dados de desenvolvimento do WakaTime
podem ser visualizados no aplicativo Estatísticas.

Digite:

open stats`,
}


/* === COMANDOS === */
const baseCommands = [
    'help',
    'about',
    'projects',
    'technologies',
    'contact',
    'resume',
    'stats',
    'apps',
    'ls',
    'cd',
    'pwd',
    'cat',
    'repo',
    'open',
    'whoami',
    'date',
    'echo',
    'history',
    'github',
    'linkedin',
    'email',
    'clear',
    'reset',
]


/* === AJUDA === */
const helpText =
    `WS OS Terminal

NAVEGAÇÃO
  ls                         Lista arquivos e diretórios
  cd <diretório>             Navega entre diretórios
  cd ..                      Volta um diretório
  cd ~                       Volta para a raiz
  pwd                        Exibe o diretório atual
  cat <arquivo>              Exibe um arquivo

PORTFÓLIO
  about                      Informações sobre mim
  projects                   Lista meus projetos
  technologies               Tecnologias e ferramentas
  contact                    Informações de contato
  resume                     Informações sobre currículo
  stats                      Informações sobre estatísticas
  apps                       Lista aplicativos do WS OS

ABRIR
  open <app>                 Abre um aplicativo
  open project <projeto>     Abre a demonstração de um projeto
  repo <projeto>             Exibe detalhes de um projeto

SISTEMA
  whoami                     Exibe o usuário atual
  date                       Exibe data e hora
  echo <texto>               Imprime um texto
  history                    Exibe histórico
  clear                      Limpa a tela
  reset                      Reinicia a sessão

LINKS
  github                     Abre meu GitHub
  linkedin                   Abre meu LinkedIn
  email                      Abre o cliente de e-mail

ATALHOS
  ↑ / ↓                      Histórico de comandos
  Tab                        Autocomplete

EXEMPLOS
  cd projects
  cd sna<Tab>
  cat RE<Tab>
  repo snakepy
  open project snakepy
  open stats`


function Terminal({
    onOpenApp,
}) {
    /* === ESTADO === */
    const [
        command,
        setCommand,
    ] = useState('')

    const [
        history,
        setHistory,
    ] = useState([])

    const [
        commandHistory,
        setCommandHistory,
    ] = useState([])

    const [
        historyIndex,
        setHistoryIndex,
    ] = useState(null)

    const [
        draftCommand,
        setDraftCommand,
    ] = useState('')

    const [
        currentPath,
        setCurrentPath,
    ] = useState(
        '~/portfolio',
    )


    /* === REFERÊNCIAS === */
    const terminalRef =
        useRef(null)

    const inputRef =
        useRef(null)


    /* === SCROLL AUTOMÁTICO === */
    useEffect(() => {
        const terminal =
            terminalRef.current

        if (
            !terminal
        ) {
            return
        }

        const frame =
            requestAnimationFrame(
                () => {
                    terminal.scrollTop =
                        terminal.scrollHeight
                },
            )

        return () => {
            cancelAnimationFrame(
                frame,
            )
        }
    }, [
        history,
    ])


    /* === FOCO INICIAL === */
    useEffect(() => {
        inputRef.current
            ?.focus()
    }, [])


    /* === FOCO === */
    const focusInput =
        () => {
            inputRef.current
                ?.focus()
        }


    /* === ADICIONAR HISTÓRICO === */
    const addHistory = (
        typedCommand,
        output = '',
        type = 'normal',
    ) => {
        setHistory(
            (
                currentHistory,
            ) => [
                    ...currentHistory,

                    {
                        command:
                            typedCommand,

                        output,

                        path:
                            currentPath,

                        type,
                    },
                ],
        )
    }


    /* === RESOLVER CAMINHO === */
    const resolvePath = (
        target,
    ) => {
        if (
            !target ||
            target === '~' ||
            target === '/'
        ) {
            return '~'
        }

        if (
            target === '..'
        ) {
            if (
                currentPath ===
                '~'
            ) {
                return '~'
            }

            const parts =
                currentPath.split(
                    '/',
                )

            parts.pop()

            return (
                parts.join('/') ||
                '~'
            )
        }

        if (
            target.startsWith(
                '~/',
            )
        ) {
            return target
        }

        return `${currentPath}/${target}`
    }


    /* === LISTAR DIRETÓRIO === */
    const listDirectory =
        () => {
            const directory =
                fileSystem[
                currentPath
                ]

            if (
                !directory
            ) {
                return 'Diretório não encontrado.'
            }

            const directories =
                directory.directories.map(
                    (
                        item,
                    ) =>
                        `${item}/`,
                )

            const items = [
                ...directories,
                ...directory.files,
            ]

            if (
                items.length ===
                0
            ) {
                return 'Diretório vazio.'
            }

            return items.join(
                '    ',
            )
        }


    /* === LER ARQUIVO === */
    const readFile = (
        fileName,
    ) => {
        if (
            !fileName
        ) {
            return 'Uso: cat <arquivo>'
        }

        const directory =
            fileSystem[
            currentPath
            ]

        if (
            !directory
        ) {
            return `cat: ${fileName}: diretório não encontrado`
        }

        const realFileName =
            directory.files.find(
                (
                    item,
                ) =>
                    item
                        .toLowerCase() ===
                    fileName
                        .toLowerCase(),
            )

        if (
            !realFileName
        ) {
            return `cat: ${fileName}: arquivo não encontrado`
        }

        const fullPath =
            `${currentPath}/${realFileName}`

        const content =
            fileContents[
            fullPath
            ]

        if (
            content
        ) {
            return content
        }


        /* ----- README DE PROJETO ----- */
        if (
            realFileName
                .toLowerCase() ===
            'readme.md' &&
            currentPath.startsWith(
                '~/portfolio/projects/',
            )
        ) {
            const projectId =
                currentPath
                    .split('/')
                    .pop()

            const project =
                projects[
                projectId
                ]

            if (
                project
            ) {
                return `${project.name}

                ${project.description}
                
                Tecnologias:
                ${project.technologies}
                
                GitHub:
                ${project.github}`
            }
        }


        /* ----- PDF ----- */
        if (
            realFileName
                .toLowerCase() ===
            'curriculo-warlley.pdf'
        ) {
            return `Arquivo PDF.

            Use:

            open resume`
        }

        return `Não foi possível ler: ${realFileName}`
    }


    /* === LISTAR PROJETOS === */
    const getProjectsOutput =
        () =>
            Object
                .entries(
                    projects,
                )
                .map(
                    (
                        [
                            id,
                            project,
                        ],
                    ) =>
                        `${id.padEnd(
                            22,
                            ' ',
                        )} ${project.name}`,
                )
                .join('\n')


    /* === DETALHES DO PROJETO === */
    const getProjectOutput = (
        projectName,
    ) => {
        if (
            !projectName
        ) {
            return `Uso: repo <projeto>

            Projetos disponíveis:
            ${Object.keys(
                projects,
            ).join(', ')}`
        }

        const project =
            projects[
            projectName
            ]

        if (
            !project
        ) {
            return `Projeto não encontrado: ${projectName}

            Digite projects para visualizar os projetos disponíveis.`
        }

        return `${project.name}

        Repositório:
        ${project.repository}

        Descrição:
        ${project.description}

        Tecnologias:
        ${project.technologies}

        GitHub:
        ${project.github}

        Abrir demonstração:
        open project ${projectName}`
    }


    /* === ABRIR LINK EXTERNO === */
    const openExternal = (
        url,
    ) => {
        if (
            !url
        ) {
            return
        }

        window.open(
            url,
            '_blank',
            'noopener,noreferrer',
        )
    }


    /* === ABRIR APP === */
    const openApp = (
        appId,
    ) => {
        if (
            !appId
        ) {
            return `Uso: open <app>

            Digite apps para visualizar os aplicativos disponíveis.`
        }

        if (
            !apps[
            appId
            ]
        ) {
            return `Aplicativo não encontrado: ${appId}

            Digite apps para visualizar os aplicativos disponíveis.`
        }

        onOpenApp?.(
            appId,
        )

        return `Abrindo ${apps[appId].name}...`
    }


    /* === ABRIR PROJETO === */
    const openProject = (
        projectId,
    ) => {
        if (
            !projectId
        ) {
            return `Uso: open project <projeto>

            Projetos disponíveis:
            ${Object.keys(
                projects,
            ).join(', ')}`
        }

        const project =
            projects[
            projectId
            ]

        if (
            !project
        ) {
            return `Projeto não encontrado: ${projectId}

            Digite projects para visualizar os projetos disponíveis.`
        }

        onOpenApp?.(
            `project-${project.id}`,
        )

        return `Abrindo ${project.name}...`
    }


    /* === AUTOCOMPLETE === */
    const handleAutocomplete =
        () => {
            const value =
                command

            if (
                !value.trim()
            ) {
                return
            }

            const trimmedValue =
                value.trimStart()

            const parts =
                trimmedValue.split(
                    /\s+/,
                )

            const commandName =
                parts[0]
                    .toLowerCase()


            /* ----- COMANDO PRINCIPAL ----- */
            if (
                parts.length ===
                1
            ) {
                const matches =
                    baseCommands.filter(
                        (
                            item,
                        ) =>
                            item.startsWith(
                                commandName,
                            ),
                    )

                if (
                    matches.length ===
                    1
                ) {
                    setCommand(
                        `${matches[0]} `,
                    )

                    return
                }

                if (
                    matches.length > 1
                ) {
                    addHistory(
                        value,
                        matches.join(
                            '    ',
                        ),
                        'system',
                    )
                }

                return
            }


            /* ----- CD ----- */
            if (
                commandName ===
                'cd'
            ) {
                const argument =
                    parts[1]
                        ?.toLowerCase() ??
                    ''

                const directory =
                    fileSystem[
                    currentPath
                    ]

                const options = [
                    '..',
                    '~',
                    ...(
                        directory
                            ?.directories ??
                        []
                    ),
                ]

                const matches =
                    options.filter(
                        (
                            item,
                        ) =>
                            item
                                .toLowerCase()
                                .startsWith(
                                    argument,
                                ),
                    )

                if (
                    matches.length ===
                    1
                ) {
                    setCommand(
                        `cd ${matches[0]}`,
                    )

                    return
                }

                if (
                    matches.length > 1
                ) {
                    addHistory(
                        value,
                        matches.join(
                            '    ',
                        ),
                        'system',
                    )
                }

                return
            }


            /* ----- CAT ----- */
            if (
                commandName ===
                'cat'
            ) {
                const argument =
                    parts
                        .slice(1)
                        .join(' ')
                        .toLowerCase()

                const directory =
                    fileSystem[
                    currentPath
                    ]

                const files =
                    directory?.files ??
                    []

                const matches =
                    files.filter(
                        (
                            item,
                        ) =>
                            item
                                .toLowerCase()
                                .startsWith(
                                    argument,
                                ),
                    )

                if (
                    matches.length ===
                    1
                ) {
                    setCommand(
                        `cat ${matches[0]}`,
                    )

                    return
                }

                if (
                    matches.length > 1
                ) {
                    addHistory(
                        value,
                        matches.join(
                            '    ',
                        ),
                        'system',
                    )
                }

                return
            }


            /* ----- REPO ----- */
            if (
                commandName ===
                'repo'
            ) {
                const argument =
                    parts
                        .slice(1)
                        .join(' ')
                        .toLowerCase()

                const matches =
                    Object
                        .keys(
                            projects,
                        )
                        .filter(
                            (
                                item,
                            ) =>
                                item.startsWith(
                                    argument,
                                ),
                        )

                if (
                    matches.length ===
                    1
                ) {
                    setCommand(
                        `repo ${matches[0]}`,
                    )

                    return
                }

                if (
                    matches.length > 1
                ) {
                    addHistory(
                        value,
                        matches.join(
                            '    ',
                        ),
                        'system',
                    )
                }

                return
            }


            /* ----- OPEN ----- */
            if (
                commandName ===
                'open' &&
                parts.length ===
                2
            ) {
                const argument =
                    parts[1]
                        .toLowerCase()

                const options = [
                    'project',
                    ...Object.keys(
                        apps,
                    ),
                ]

                const matches =
                    options.filter(
                        (
                            item,
                        ) =>
                            item.startsWith(
                                argument,
                            ),
                    )

                if (
                    matches.length ===
                    1
                ) {
                    setCommand(
                        `open ${matches[0]} `,
                    )

                    return
                }

                if (
                    matches.length > 1
                ) {
                    addHistory(
                        value,
                        matches.join(
                            '    ',
                        ),
                        'system',
                    )
                }

                return
            }


            /* ----- OPEN PROJECT ----- */
            if (
                commandName ===
                'open' &&
                parts[1]
                    ?.toLowerCase() ===
                'project'
            ) {
                const argument =
                    parts
                        .slice(2)
                        .join(' ')
                        .toLowerCase()

                const matches =
                    Object
                        .keys(
                            projects,
                        )
                        .filter(
                            (
                                item,
                            ) =>
                                item.startsWith(
                                    argument,
                                ),
                        )

                if (
                    matches.length ===
                    1
                ) {
                    setCommand(
                        `open project ${matches[0]}`,
                    )

                    return
                }

                if (
                    matches.length > 1
                ) {
                    addHistory(
                        value,
                        matches.join(
                            '    ',
                        ),
                        'system',
                    )
                }
            }
        }


    /* === EXECUTAR COMANDO === */
    const executeCommand =
        () => {
            const rawCommand =
                command.trim()

            if (
                !rawCommand
            ) {
                return
            }

            const parts =
                rawCommand.split(
                    /\s+/,
                )

            const commandName =
                parts[0]
                    .toLowerCase()

            const normalizedArguments =
                parts
                    .slice(1)
                    .map(
                        (
                            item,
                        ) =>
                            item.toLowerCase(),
                    )

            const argument =
                normalizedArguments.join(
                    ' ',
                )

            setCommandHistory(
                (
                    current,
                ) => [
                        ...current,
                        rawCommand,
                    ],
            )

            setHistoryIndex(
                null,
            )

            setDraftCommand(
                '',
            )


            /* === CLEAR === */
            if (
                commandName ===
                'clear'
            ) {
                setHistory(
                    [],
                )

                setCommand(
                    '',
                )

                return
            }


            /* === RESET === */
            if (
                commandName ===
                'reset'
            ) {
                setHistory(
                    [],
                )

                setCommandHistory(
                    [],
                )

                setHistoryIndex(
                    null,
                )

                setDraftCommand(
                    '',
                )

                setCurrentPath(
                    '~/portfolio',
                )

                setCommand(
                    '',
                )

                return
            }


            let output


            /* === COMANDOS === */
            switch (
            commandName
            ) {
                case 'help':
                    output =
                        helpText
                    break

                case 'about':
                    output =
                        fileContents[
                        '~/portfolio/about/profile.txt'
                        ]
                    break

                case 'projects':
                    output =
                        `Projetos disponíveis:

                        ${getProjectsOutput()}

                        Detalhes:
                        repo <projeto>

                        Abrir:
                        open project <projeto>`
                    break

                case 'technologies':
                    output =
                        fileContents[
                        '~/portfolio/technologies/stack.txt'
                        ]
                    break

                case 'contact':
                    output =
                        fileContents[
                        '~/portfolio/contact/contact.txt'
                        ]
                    break

                case 'resume':
                    output =
                        `Currículo profissional

                        Use:

                        open resume

                        para visualizar o PDF dentro do WS OS.`
                    break

                case 'stats':
                    output =
                        `Estatísticas de desenvolvimento

                        Integrações:
                        - GitHub
                        - WakaTime
                        - Linguagens
                        - Repositórios
                        - Atividade por período
                        
                        Use:
                        
                        open stats`
                    break

                case 'apps':
                    output =
                        Object
                            .entries(
                                apps,
                            )
                            .map(
                                (
                                    [
                                        id,
                                        app,
                                    ],
                                ) =>
                                    `${id.padEnd(
                                        16,
                                        ' ',
                                    )} ${app.name}`,
                            )
                            .join('\n')
                    break

                case 'ls':
                    output =
                        listDirectory()
                    break

                case 'pwd':
                    output =
                        currentPath
                    break

                case 'cd': {
                    const targetPath =
                        resolvePath(
                            argument,
                        )

                    if (
                        fileSystem[
                        targetPath
                        ]
                    ) {
                        setCurrentPath(
                            targetPath,
                        )

                        output =
                            ''
                    } else {
                        output =
                            `cd: ${argument}: diretório não encontrado`
                    }

                    break
                }

                case 'cat': {
                    const originalArgument =
                        parts
                            .slice(1)
                            .join(' ')

                    output =
                        readFile(
                            originalArgument,
                        )

                    break
                }

                case 'repo':
                    output =
                        getProjectOutput(
                            argument,
                        )
                    break

                case 'open': {
                    if (
                        normalizedArguments[0] ===
                        'project'
                    ) {
                        const projectId =
                            normalizedArguments
                                .slice(1)
                                .join(' ')

                        output =
                            openProject(
                                projectId,
                            )

                        break
                    }

                    output =
                        openApp(
                            argument,
                        )

                    break
                }

                case 'whoami':
                    output =
                        `warlley

                        Warlley Silva Baião Braga
                        Estudante de Engenharia de Software
                        PUC Minas`
                    break

                case 'date':
                    output =
                        new Intl.DateTimeFormat(
                            'pt-BR',
                            {
                                dateStyle:
                                    'full',

                                timeStyle:
                                    'medium',
                            },
                        ).format(
                            new Date(),
                        )
                    break

                case 'echo':
                    output =
                        rawCommand.replace(
                            /^echo\s*/i,
                            '',
                        )
                    break

                case 'history':
                    output =
                        commandHistory
                            .concat(
                                rawCommand,
                            )
                            .map(
                                (
                                    item,
                                    index,
                                ) =>
                                    `${String(
                                        index + 1,
                                    ).padStart(
                                        3,
                                        ' ',
                                    )}  ${item}`,
                            )
                            .join('\n')
                    break

                case 'github':
                    openExternal(
                        externalLinks.github,
                    )

                    output =
                        'Abrindo GitHub...'
                    break

                case 'linkedin':
                    openExternal(
                        externalLinks.linkedin,
                    )

                    output =
                        'Abrindo LinkedIn...'
                    break

                case 'email':
                    window.location.href =
                        externalLinks.email

                    output =
                        'Abrindo cliente de e-mail...'
                    break

                default:
                    output =
                        `Comando não encontrado: ${commandName}

                        Digite help para visualizar os comandos disponíveis.`
                    break
            }

            addHistory(
                rawCommand,
                output,
            )

            setCommand(
                '',
            )
        }


    /* === HISTÓRICO DE COMANDOS === */
    const navigateHistory = (
        direction,
    ) => {
        if (
            commandHistory.length ===
            0
        ) {
            return
        }

        if (
            direction ===
            'up'
        ) {
            if (
                historyIndex ===
                null
            ) {
                setDraftCommand(
                    command,
                )

                const nextIndex =
                    commandHistory.length -
                    1

                setHistoryIndex(
                    nextIndex,
                )

                setCommand(
                    commandHistory[
                    nextIndex
                    ],
                )

                return
            }

            const nextIndex =
                Math.max(
                    historyIndex - 1,
                    0,
                )

            setHistoryIndex(
                nextIndex,
            )

            setCommand(
                commandHistory[
                nextIndex
                ],
            )

            return
        }

        if (
            historyIndex ===
            null
        ) {
            return
        }

        const nextIndex =
            historyIndex +
            1

        if (
            nextIndex >=
            commandHistory.length
        ) {
            setHistoryIndex(
                null,
            )

            setCommand(
                draftCommand,
            )

            return
        }

        setHistoryIndex(
            nextIndex,
        )

        setCommand(
            commandHistory[
            nextIndex
            ],
        )
    }


    /* === TECLADO === */
    const handleKeyDown = (
        event,
    ) => {
        if (
            event.key ===
            'Enter'
        ) {
            event.preventDefault()

            executeCommand()

            return
        }

        if (
            event.key ===
            'ArrowUp'
        ) {
            event.preventDefault()

            navigateHistory(
                'up',
            )

            return
        }

        if (
            event.key ===
            'ArrowDown'
        ) {
            event.preventDefault()

            navigateHistory(
                'down',
            )

            return
        }

        if (
            event.key ===
            'Tab'
        ) {
            event.preventDefault()

            handleAutocomplete()
        }
    }


    /* === ALTERAR COMANDO === */
    const handleCommandChange = (
        event,
    ) => {
        const value =
            event.target.value

        setCommand(
            value,
        )

        if (
            historyIndex !==
            null
        ) {
            setHistoryIndex(
                null,
            )

            setDraftCommand(
                value,
            )
        }
    }


    /* === LIMPAR TERMINAL === */
    const clearTerminal =
        () => {
            setHistory(
                [],
            )

            setCommand(
                '',
            )

            setHistoryIndex(
                null,
            )

            setDraftCommand(
                '',
            )

            focusInput()
        }


    /* === RESETAR TERMINAL === */
    const resetTerminal =
        () => {
            setHistory(
                [],
            )

            setCommand(
                '',
            )

            setCommandHistory(
                [],
            )

            setHistoryIndex(
                null,
            )

            setDraftCommand(
                '',
            )

            setCurrentPath(
                '~/portfolio',
            )

            focusInput()
        }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="portfolio-terminal-shell">

            {/* === CABEÇALHO === */}
            <header className="portfolio-terminal-header">
                <div className="portfolio-terminal-header-info">
                    <span
                        className="portfolio-terminal-status"
                        aria-hidden="true"
                    />

                    <div>
                        <strong>
                            WS OS Terminal
                        </strong>

                        <span>
                            sessão local
                        </span>
                    </div>
                </div>

                <div className="portfolio-terminal-actions">
                    <Tooltip
                        text="Limpar terminal"
                        position="bottom"
                    >
                        <button
                            type="button"
                            onClick={
                                clearTerminal
                            }
                            aria-label="Limpar terminal"
                        >
                            <Trash2
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </button>
                    </Tooltip>

                    <Tooltip
                        text="Reiniciar terminal"
                        position="bottom"
                    >
                        <button
                            type="button"
                            onClick={
                                resetTerminal
                            }
                            aria-label="Reiniciar terminal"
                        >
                            <RotateCcw
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </button>
                    </Tooltip>
                </div>
            </header>


            {/* === TERMINAL === */}
            <div
                className="portfolio-terminal"
                ref={
                    terminalRef
                }
                onClick={
                    focusInput
                }
            >

                {/* === APRESENTAÇÃO === */}
                {history.length === 0 && (
                    <div className="portfolio-terminal-welcome">
                        <strong>
                            WS OS Terminal
                        </strong>

                        <span>
                            Interface de linha de comando
                            do portfólio.
                        </span>

                        <span>
                            Digite{' '}
                            <b>
                                help
                            </b>{' '}
                            para visualizar os comandos.
                        </span>

                        <span className="portfolio-terminal-shortcuts">
                            ↑↓ histórico · Tab autocomplete
                        </span>
                    </div>
                )}


                {/* === HISTÓRICO === */}
                <div
                    className="portfolio-terminal-history-list"
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions"
                >
                    {history.map(
                        (
                            item,
                            index,
                        ) => (
                            <div
                                className="portfolio-terminal-history"
                                key={
                                    `${item.command}-${index}`
                                }
                            >
                                <div className="portfolio-terminal-line">
                                    <span className="portfolio-terminal-user">
                                        warlley
                                    </span>

                                    <span className="portfolio-terminal-separator">
                                        @
                                    </span>

                                    <span className="portfolio-terminal-host">
                                        ws-os
                                    </span>

                                    <span className="portfolio-terminal-separator">
                                        :
                                    </span>

                                    <span className="portfolio-terminal-path">
                                        {
                                            item.path
                                        }
                                    </span>

                                    <span className="portfolio-terminal-symbol">
                                        $
                                    </span>

                                    <span className="portfolio-terminal-command">
                                        {
                                            item.command
                                        }
                                    </span>
                                </div>

                                {item.output && (
                                    <pre
                                        className={[
                                            'portfolio-terminal-output',

                                            item.type ===
                                                'system'
                                                ? 'portfolio-terminal-output-system'
                                                : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    >
                                        {
                                            item.output
                                        }
                                    </pre>
                                )}
                            </div>
                        ),
                    )}
                </div>


                {/* === LINHA ATUAL === */}
                <div className="portfolio-terminal-line portfolio-terminal-current">
                    <span className="portfolio-terminal-user">
                        warlley
                    </span>

                    <span className="portfolio-terminal-separator">
                        @
                    </span>

                    <span className="portfolio-terminal-host">
                        ws-os
                    </span>

                    <span className="portfolio-terminal-separator">
                        :
                    </span>

                    <span className="portfolio-terminal-path">
                        {
                            currentPath
                        }
                    </span>

                    <span className="portfolio-terminal-symbol">
                        $
                    </span>

                    <input
                        ref={
                            inputRef
                        }
                        className="portfolio-terminal-input"
                        type="text"
                        value={
                            command
                        }
                        onChange={
                            handleCommandChange
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                        aria-label="Terminal do WS OS"
                    />
                </div>
            </div>
        </div>
    )
}


export default Terminal