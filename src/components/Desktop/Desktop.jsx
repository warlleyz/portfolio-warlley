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

    const apps = [
        {
            id: 'about',
            name: 'Sobre mim',
            icon: <UserRound size={30} strokeWidth={1.8} />,
        },
        {
            id: 'projects',
            name: 'Projetos',
            icon: <Folder size={30} strokeWidth={1.8} />,
        },
        {
            id: 'technologies',
            name: 'Tecnologias',
            icon: <Cpu size={30} strokeWidth={1.8} />,
        },
        {
            id: 'contact',
            name: 'Contato',
            icon: <Mail size={30} strokeWidth={1.8} />,
        },
        {
            id: 'resume',
            name: 'Currículo',
            icon: <FileText size={30} strokeWidth={1.8} />,
        },
        {
            id: 'terminal',
            name: 'Terminal',
            icon: <TerminalSquare size={30} strokeWidth={1.8} />,
        },
    ]

    return (
        <main className="desktop">
            <section className="desktop-shortcuts">
                {apps.map((app) => (
                    <button
                        key={app.id}
                        className="shortcut"
                        type="button"
                        onClick={() => {
                            if (app.id === 'about') {
                                setTestWindowOpen(true)
                                setTestWindowMinimized(false)
                            }
                        }}
                    >
                        <span className="shortcut-icon">
                            {app.icon}
                        </span>

                        <span className="shortcut-name">
                            {app.name}
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