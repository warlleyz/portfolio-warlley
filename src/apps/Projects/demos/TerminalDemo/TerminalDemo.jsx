import { useState } from 'react'

import './TerminalDemo.css'

function TerminalDemo({ project }) {
    const [command, setCommand] = useState('')
    const [history, setHistory] = useState([])

    const executeCommand = () => {
        const typedCommand = command.trim()

        if (!typedCommand) {
            return
        }

        if (typedCommand === 'clear') {
            setHistory([])
            setCommand('')
            return
        }

        let output = ''

        if (typedCommand === 'help') {
            output = `Comandos disponíveis:

help
clear`
        } else {
            output = `Demonstração de "${project.title}" ainda não configurada.`
        }

        setHistory((previous) => [
            ...previous,
            {
                command: typedCommand,
                output,
            },
        ])

        setCommand('')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            executeCommand()
        }
    }

    return (
        <div className="terminal-demo">
            {history.map((item, index) => (
                <div
                    className="terminal-history"
                    key={`${item.command}-${index}`}
                >
                    <div className="terminal-line">
                        <span className="terminal-user">
                            warlley@portfolio
                        </span>

                        <span className="terminal-separator">
                            :
                        </span>

                        <span className="terminal-path">
                            ~/{project.id}
                        </span>

                        <span className="terminal-symbol">
                            $
                        </span>

                        <span>
                            {item.command}
                        </span>
                    </div>

                    <pre className="terminal-output">
                        {item.output}
                    </pre>
                </div>
            ))}

            <div className="terminal-line">
                <span className="terminal-user">
                    warlley@portfolio
                </span>

                <span className="terminal-separator">
                    :
                </span>

                <span className="terminal-path">
                    ~/{project.id}
                </span>

                <span className="terminal-symbol">
                    $
                </span>

                <input
                    className="terminal-input"
                    type="text"
                    value={command}
                    onChange={(event) =>
                        setCommand(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck="false"
                    aria-label={`Terminal do projeto ${project.title}`}
                />
            </div>
        </div>
    )
}

export default TerminalDemo