import {
    useEffect,
    useRef,
    useState,
} from 'react'

import './Terminal.css'

const commands = {
    help: `Comandos disponíveis:

about               Exibe informações sobre mim
projects            Exibe meus projetos
technologies        Exibe tecnologias e ferramentas
contact             Exibe informações de contato
resume              Exibe informações sobre currículo

open about          Abre Sobre mim
open projects       Abre Projetos
open technologies   Abre Tecnologias
open contact        Abre Contato
open resume         Abre Currículo

clear               Limpa o terminal`,

    about: `Warlley Silva Baião Braga

Estudante de Engenharia de Software na PUC Minas.

Interesses:
- Desenvolvimento de sistemas
- Automação
- APIs
- Dados
- Inteligência Artificial`,

    projects: `Projetos:

1. API Clima
   Java + Spring Boot + Open-Meteo

2. Carrinho de Compras
   Java + Programação Orientada a Objetos

3. Login PUC
   Spring Boot + HTML + CSS

4. SnakePy
   Python + Pygame`,

    technologies: `Tecnologias:

Linguagens:
Java, JavaScript, Python, PHP, HTML e CSS

Backend:
Spring Boot, APIs REST e Maven

Ferramentas:
Git, GitHub, Docker e Postman

Design e dados:
Figma, Power BI e Banco de Dados`,

    contact: `Contato:

E-mail:
warlleysilvax@gmail.com

GitHub:
github.com/warlleyz

LinkedIn:
linkedin.com/in/warlleysilvab`,

    resume: `Currículo profissional

O currículo será disponibilizado em PDF
diretamente pelo portfólio.`,
}

const allowedApps = [
    'about',
    'projects',
    'technologies',
    'contact',
    'resume',
]

const appNames = {
    about: 'Sobre mim',
    projects: 'Projetos',
    technologies: 'Tecnologias',
    contact: 'Contato',
    resume: 'Currículo',
}

function Terminal({ onOpenApp }) {
    const [command, setCommand] = useState('')
    const [history, setHistory] = useState([])

    const terminalRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        const terminal = terminalRef.current

        if (!terminal) return

        requestAnimationFrame(() => {
            terminal.scrollTop =
                terminal.scrollHeight
        })
    }, [history])

    const addHistory = (
        typedCommand,
        output,
    ) => {
        setHistory((currentHistory) => [
            ...currentHistory,
            {
                command: typedCommand,
                output,
            },
        ])
    }

    const executeCommand = () => {
        const typedCommand =
            command.trim().toLowerCase()

        if (!typedCommand) return

        if (typedCommand === 'clear') {
            setHistory([])
            setCommand('')
            return
        }

        if (typedCommand.startsWith('open ')) {
            const appName =
                typedCommand
                    .replace('open ', '')
                    .trim()

            if (allowedApps.includes(appName)) {
                onOpenApp?.(appName)

                addHistory(
                    typedCommand,
                    `Abrindo ${appNames[appName]}...`,
                )

                setCommand('')
                return
            }

            addHistory(
                typedCommand,
                `Aplicativo não encontrado: ${appName}

Digite help para visualizar os aplicativos disponíveis.`,
            )

            setCommand('')
            return
        }

        const commandExists =
            Object.prototype.hasOwnProperty.call(
                commands,
                typedCommand,
            )

        const output =
            commandExists
                ? commands[typedCommand]
                : `Comando não encontrado: ${typedCommand}

Digite help para visualizar os comandos disponíveis.`

        addHistory(
            typedCommand,
            output,
        )

        setCommand('')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            executeCommand()
        }
    }

    const showHint =
        history.length === 0 &&
        command.length === 0

    return (
        <div
            className="portfolio-terminal"
            ref={terminalRef}
            onClick={() =>
                inputRef.current?.focus()
            }
        >
            {showHint && (
                <div className="portfolio-terminal-hint">
                    Digite <strong>help</strong> para
                    ver os comandos disponíveis.
                </div>
            )}

            {history.map((item, index) => (
                <div
                    className="portfolio-terminal-history"
                    key={`${item.command}-${index}`}
                >
                    <div className="portfolio-terminal-line">
                        <span className="portfolio-terminal-user">
                            warlley
                        </span>

                        <span className="portfolio-terminal-separator">
                            @
                        </span>

                        <span className="portfolio-terminal-path">
                            portfolio
                        </span>

                        <span className="portfolio-terminal-symbol">
                            $
                        </span>

                        <span>
                            {item.command}
                        </span>
                    </div>

                    <pre className="portfolio-terminal-output">
                        {item.output}
                    </pre>
                </div>
            ))}

            <div className="portfolio-terminal-line">
                <span className="portfolio-terminal-user">
                    warlley
                </span>

                <span className="portfolio-terminal-separator">
                    @
                </span>

                <span className="portfolio-terminal-path">
                    portfolio
                </span>

                <span className="portfolio-terminal-symbol">
                    $
                </span>

                <input
                    ref={inputRef}
                    className="portfolio-terminal-input"
                    type="text"
                    value={command}
                    onChange={(event) =>
                        setCommand(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    autoFocus
                    autoComplete="off"
                    spellCheck="false"
                    aria-label="Terminal"
                />
            </div>
        </div>
    )
}

export default Terminal