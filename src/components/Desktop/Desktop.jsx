import './Desktop.css'
import Taskbar from '../Taskbar/Taskbar'
import Window from '../Window/Window'
import { useState } from 'react'

import {
    UserRound,
    Folder,
    Cpu,
    Mail,
    FileText,
    TerminalSquare,
} from 'lucide-react'

function Desktop({ theme, toggleTheme }) {
    const [testWindowOpen, setTestWindowOpen] = useState(true)
    const [testWindowMaximized, setTestWindowMaximized] = useState(false)
    const [testWindowMinimized, setTestWindowMinimized] = useState(false)
    const [testWindowMinimizing, setTestWindowMinimizing] = useState(false)
    const [testWindowClosing, setTestWindowClosing] = useState(false)

    const minimizeTestWindow = () => {
        setTestWindowMinimizing(true)

        setTimeout(() => {
            setTestWindowMinimized(true)
            setTestWindowMinimizing(false)
        }, 200)
    }

    const restoreTestWindow = () => {
        setTestWindowMinimized(false)
    }

    const toggleTestWindow = () => {
        if (testWindowMinimized) {
            restoreTestWindow()
        } else {
            minimizeTestWindow()
        }
    }

    const closeTestWindow = () => {
        setTestWindowClosing(true)

        setTimeout(() => {
            setTestWindowOpen(false)
            setTestWindowMinimized(false)
            setTestWindowMaximized(false)
            setTestWindowMinimizing(false)
            setTestWindowClosing(false)
        }, 200)
    }

    const shortcuts = [
        {
            name: 'Sobre mim',
            icon: <UserRound size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Projetos',
            icon: <Folder size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Tecnologias',
            icon: <Cpu size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Contato',
            icon: <Mail size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Currículo',
            icon: <FileText size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Terminal',
            icon: <TerminalSquare size={30} strokeWidth={1.8} />,
        },
    ]

    return (
        <main className="desktop">
            <section className="desktop-shortcuts">
                {shortcuts.map((shortcut) => (
                    <button
                        key={shortcut.name}
                        className="shortcut"
                        type="button"
                        onClick={() => {
                            if (shortcut.name === 'Sobre mim') {
                                setTestWindowOpen(true)
                                setTestWindowMinimized(false)
                            }
                        }}
                    >
                        <span className="shortcut-icon">
                            {shortcut.icon}
                        </span>

                        <span className="shortcut-name">
                            {shortcut.name}
                        </span>
                    </button>
                ))}
            </section>

            {testWindowOpen && !testWindowMinimized && (
                <Window
                    title="Teste"
                    maximized={testWindowMaximized}
                    minimizing={testWindowMinimizing}
                    closing={testWindowClosing}
                    onClose={closeTestWindow}
                    onMinimize={minimizeTestWindow}
                    onMaximize={() =>
                        setTestWindowMaximized((previous) => !previous)
                    }
                >
                    <p>Minha primeira janela.</p>
                </Window>
            )}

            <Taskbar
                theme={theme}
                toggleTheme={toggleTheme}
                testWindowOpen={testWindowOpen}
                testWindowMinimized={testWindowMinimized}
                toggleTestWindow={toggleTestWindow}
            />
        </main>
    )
}

export default Desktop