import { useRef, useState } from 'react'

import {
    UserRound,
    Folder,
    Cpu,
    Mail,
    FileText,
    TerminalSquare,
} from 'lucide-react'

import About from '../../apps/About/About'
import Projects from '../../apps/Projects/Projects'
import TerminalDemo from '../../apps/Projects/demos/TerminalDemo/TerminalDemo'

import projectsData from '../../data/projectsData'

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

const projectApps = projectsData.map((project) => {
    const Icon = project.icon

    return {
        id: `project-${project.id}`,
        projectId: project.id,
        name: project.title,
        icon: <Icon size={30} strokeWidth={1.8} />,
    }
})

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
        openApp(`project-${project.id}`)
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

    const renderProjectContent = (projectId) => {
        const project = projectsData.find(
            (item) => item.id === projectId,
        )

        if (!project) {
            return <p>Projeto não encontrado.</p>
        }

        switch (project.demoType) {
            case 'terminal':
                return (
                    <TerminalDemo
                        project={project}
                    />
                )

            case 'web':
                return (
                    <div>
                        <h2>{project.title}</h2>
                        <p>Projeto web.</p>
                    </div>
                )

            case 'media':
                return (
                    <div>
                        <h2>{project.title}</h2>
                        <p>Demonstração em mídia.</p>
                    </div>
                )

            case 'details':
                return (
                    <div>
                        <h2>{project.title}</h2>
                        <p>Detalhes do projeto.</p>
                    </div>
                )

            default:
                return (
                    <p>
                        Tipo de demonstração não suportado.
                    </p>
                )
        }
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

            default:
                if (appId.startsWith('project-')) {
                    const projectId =
                        appId.replace(
                            'project-',
                            '',
                        )

                    return renderProjectContent(
                        projectId,
                    )
                }

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
                        maximized={windowState.maximized}
                        minimizing={windowState.minimizing}
                        closing={windowState.closing}
                        position={windowState.position}
                        size={windowState.size}
                        zIndex={windowState.zIndex}
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
                toggleTaskbarApp={toggleTaskbarApp}
            />
        </main>
    )
}

export default Desktop