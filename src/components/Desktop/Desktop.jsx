import { useRef, useState } from 'react'

import {
    UserRound,
    Folder,
    Cpu,
    Mail,
    FileText,
    TerminalSquare,
    LogIn,
} from 'lucide-react'

import About from '../../apps/About/About'
import Projects from '../../apps/Projects/Projects'

import Taskbar from '../Taskbar/Taskbar'
import Window from '../Window/Window'

import './Desktop.css'

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

const projectApps = [
    {
        id: 'project-login-puc',
        projectId: 'login-puc',
        name: 'Login PUC',
        icon: <LogIn size={30} strokeWidth={1.8} />,
    },
]

const allApps = [
    ...apps,
    ...projectApps,
]

function Desktop({ theme, toggleTheme }) {
    const [windows, setWindows] = useState({})
    const topZIndex = useRef(10)

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

    const openApp = (appId) => {
        const nextZIndex = getNextZIndex()

        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                open: true,
                minimized: false,
                minimizing: false,
                closing: false,
                maximized:
                    previous[appId]?.maximized ?? false,
                position:
                    previous[appId]?.position ?? null,
                size:
                    previous[appId]?.size ?? null,
                zIndex: nextZIndex,
            },
        }))
    }

    const openProject = (project) => {
        const projectApp = projectApps.find(
            (app) => app.projectId === project.id,
        )

        if (!projectApp) {
            return
        }

        openApp(projectApp.id)
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

    const resizeApp = (appId, size) => {
        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                size,
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
            return
        }

        minimizeApp(appId)
    }

    const toggleMaximizeApp = (appId) => {
        setWindows((previous) => ({
            ...previous,
            [appId]: {
                ...previous[appId],
                maximized:
                    !previous[appId]?.maximized,
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
                    ...previous[appId],
                    open: false,
                    minimized: false,
                    maximized: false,
                    minimizing: false,
                    closing: false,
                },
            }))
        }, 200)
    }

    const renderAppContent = (appId) => {
        switch (appId) {
            case 'about':
                return <About />

            case 'projects':
                return (
                    <Projects
                        onOpenProject={openProject}
                    />
                )

            case 'project-login-puc':
                return (
                    <div>
                        <h2>Login PUC</h2>

                        <p>
                            Projeto web em desenvolvimento.
                        </p>
                    </div>
                )

            default:
                return (
                    <p>
                        Aplicativo em desenvolvimento.
                    </p>
                )
        }
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

            {allApps.map((app) => {
                const windowState =
                    windows[app.id]

                if (
                    !windowState?.open ||
                    windowState.minimized
                ) {
                    return null
                }

                return (
                    <Window
                        key={app.id}
                        title={app.name}
                        maximized={
                            windowState.maximized
                        }
                        minimizing={
                            windowState.minimizing
                        }
                        closing={
                            windowState.closing
                        }
                        position={
                            windowState.position
                        }
                        size={
                            windowState.size
                        }
                        zIndex={
                            windowState.zIndex
                        }
                        onFocus={() =>
                            focusApp(app.id)
                        }
                        onPositionChange={(position) =>
                            moveApp(app.id, position)
                        }
                        onSizeChange={(size) =>
                            resizeApp(app.id, size)
                        }
                        onClose={() =>
                            closeApp(app.id)
                        }
                        onMinimize={() =>
                            minimizeApp(app.id)
                        }
                        onMaximize={() =>
                            toggleMaximizeApp(app.id)
                        }
                    >
                        {renderAppContent(app.id)}
                    </Window>
                )
            })}

            <Taskbar
                theme={theme}
                toggleTheme={toggleTheme}
                apps={allApps}
                windows={windows}
                toggleTaskbarApp={
                    toggleTaskbarApp
                }
            />
        </main>
    )
}

export default Desktop