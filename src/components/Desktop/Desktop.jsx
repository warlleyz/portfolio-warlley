import './Desktop.css'
import Taskbar from '../Taskbar/Taskbar'
import Window from '../Window/Window'
import { useRef, useState } from 'react'

import {
    UserRound,
    Folder,
    Cpu,
    Mail,
    FileText,
    TerminalSquare,
} from 'lucide-react'

function Desktop({ theme, toggleTheme }) {
    const topZIndex = useRef(10)
    const [windows, setWindows] = useState({})

    const getNextZIndex = () => {
        topZIndex.current += 1
        return topZIndex.current
    }

    const focusApp = (appId) => {
        const nextZIndex = getNextZIndex()

        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                zIndex: nextZIndex,
            },
        }))
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

    const openApp = (appId) => {
        const nextZIndex = getNextZIndex()

        setWindows((previous) => ({
            ...previous,
            [appId]: {
                open: true,
                minimized: false,
                maximized: previous[appId]?.maximized ?? false,
                minimizing: false,
                closing: false,
                position: previous[appId]?.position ?? null,
                zIndex: nextZIndex,
            },
        }))
    }

    const moveApp = (appId, position) => {
        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                position,
            },
        }))
    }

    const minimizeApp = (appId) => {
        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                minimizing: true,
            },
        }))

        setTimeout(() => {
            setWindows((previous) => ({
                ...previous,
                [appId]: {
                    ...previous[appId],
                    minimized: true,
                    minimizing: false,
                },
            }))
        }, 200)
    }

    const restoreApp = (appId) => {
        const nextZIndex = getNextZIndex()

        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                minimized: false,
                zIndex: nextZIndex,
            },
        }))
    }

    const toggleTaskbarApp = (appId) => {
        if (windows[appId]?.minimized) {
            restoreApp(appId)
        } else {
            minimizeApp(appId)
        }
    }

    const toggleMaximizeApp = (appId) => {
        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                maximized: !previous[appId]?.maximized,
            },
        }))
    }

    const closeApp = (appId) => {
        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                closing: true,
            },
        }))

        setTimeout(() => {
            setWindows((previous) => ({
                ...previous,
                [appId]: {
                    open: false,
                    minimized: false,
                    maximized: false,
                    minimizing: false,
                    closing: false,
                },
            }))
        }, 200)
    }

    return (
        <main className="desktop">
            <section className="desktop-shortcuts">
                {apps.map((app) => (
                    <button
                        key={app.id}
                        className="shortcut"
                        type="button"
                        onClick={() => openApp(app.id)}
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

            {apps.map((app) => {
                const windowState = windows[app.id]

                if (!windowState?.open || windowState.minimized) {
                    return null
                }

                return (
                    <Window
                        key={app.id}
                        title={app.name}
                        maximized={windowState.maximized}
                        minimizing={windowState.minimizing}
                        closing={windowState.closing}
                        position={windowState.position}
                        onPositionChange={(position) =>
                            moveApp(app.id, position)
                        }
                        zIndex={windowState.zIndex}
                        onFocus={() => focusApp(app.id)}
                        onClose={() => closeApp(app.id)}
                        onMinimize={() => minimizeApp(app.id)}
                        onMaximize={() => toggleMaximizeApp(app.id)}
                    >
                        <p>{app.name}</p>
                    </Window>
                )
            })}

            <Taskbar
                theme={theme}
                toggleTheme={toggleTheme}
                apps={apps}
                windows={windows}
                toggleTaskbarApp={toggleTaskbarApp}
            />
        </main>
    )
}

export default Desktop