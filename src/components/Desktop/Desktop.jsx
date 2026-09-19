import {
    useRef,
    useState,
} from 'react'

import About from '../../apps/About/About'
import Projects from '../../apps/Projects/Projects'
import Technologies from '../../apps/Technologies/Technologies'
import Contact from '../../apps/Contact/Contact'
import Resume from '../../apps/Resume/Resume'
import Terminal from '../../apps/Terminal/Terminal'
import Stats from '../../apps/Stats/Stats'
import Game from '../../apps/Game/Game'
import ProjectDemo from '../../apps/Projects/ProjectDemo'

import appsData from '../../data/appsData'
import projectsData from '../../data/projectsData'

import Taskbar from '../Taskbar/Taskbar'
import Window from '../Window/Window'

import './Desktop.css'


/* === APLICATIVOS === */

/* ----- APPS PRINCIPAIS ----- */
const apps = appsData


/* ----- PROJETOS ----- */
const projectApps =
    projectsData.map((project) => {
        const Icon =
            project.icon

        return {
            id:
                `project-${project.id}`,

            projectId:
                project.id,

            name:
                project.title,

            icon: Icon,
        }
    })


/* ----- TODOS OS APPS ----- */
const allApps = [
    ...apps,
    ...projectApps,
]


function Desktop({
    theme,
    toggleTheme,
}) {
    const [
        windows,
        setWindows,
    ] = useState({})

    const topZIndex =
        useRef(10)


    /* === JANELAS === */

    /* ----- Z-INDEX ----- */
    const getNextZIndex = () => {
        topZIndex.current += 1

        return topZIndex.current
    }


    /* ----- FOCO ----- */
    const focusApp = (appId) => {
        const nextZIndex =
            getNextZIndex()

        setWindows((previous) => ({
            ...previous,

            [appId]: {
                ...previous[appId],

                zIndex:
                    nextZIndex,
            },
        }))
    }


    /* ----- ABRIR ----- */
    const openApp = (appId) => {
        const nextZIndex =
            getNextZIndex()

        setWindows((previous) => {
            const currentWindow =
                previous[appId]

            const app =
                appsData.find(
                    (item) =>
                        item.id === appId,
                )

            let initialSize =
                currentWindow?.size ??
                null

            let initialPosition =
                currentWindow?.position ??
                null

            if (
                app?.window &&
                !currentWindow?.size
            ) {
                const width =
                    Math.min(
                        app.window.width,
                        window.innerWidth - 80,
                    )

                const height =
                    Math.min(
                        app.window.height,
                        window.innerHeight - 110,
                    )

                initialSize = {
                    width,
                    height,
                }

                if (
                    app.window.centered
                ) {
                    initialPosition = {
                        x:
                            Math.max(
                                (
                                    window.innerWidth -
                                    width
                                ) / 2,
                                0,
                            ),

                        y:
                            Math.max(
                                (
                                    window.innerHeight -
                                    height
                                ) / 2,
                                0,
                            ),
                    }
                }
            }

            return {
                ...previous,

                [appId]: {
                    ...currentWindow,

                    open: true,
                    minimized: false,
                    minimizing: false,
                    closing: false,

                    maximized:
                        currentWindow
                            ?.maximized ??
                        false,

                    position:
                        initialPosition,

                    size:
                        initialSize,

                    zIndex:
                        nextZIndex,
                },
            }
        })
    }


    /* ----- PROJETOS ----- */
    const openProject = (
        project,
    ) => {
        openApp(
            `project-${project.id}`,
        )
    }


    /* ----- MOVIMENTO ----- */
    const moveApp = (
        appId,
        position,
    ) => {
        setWindows((previous) => ({
            ...previous,

            [appId]: {
                ...previous[appId],

                position,
            },
        }))
    }


    /* ----- REDIMENSIONAMENTO ----- */
    const resizeApp = (
        appId,
        size,
    ) => {
        setWindows((previous) => ({
            ...previous,

            [appId]: {
                ...previous[appId],

                size,
            },
        }))
    }


    /* ----- MINIMIZAR ----- */
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


    /* ----- RESTAURAR ----- */
    const restoreApp = (appId) => {
        const nextZIndex =
            getNextZIndex()

        setWindows((previous) => ({
            ...previous,

            [appId]: {
                ...previous[appId],

                minimized: false,

                zIndex:
                    nextZIndex,
            },
        }))
    }


    /* ----- TASKBAR ----- */
    const toggleTaskbarApp = (
        appId,
    ) => {
        const currentWindow =
            windows[appId]

        if (!currentWindow) {
            return
        }

        if (
            currentWindow.minimized
        ) {
            restoreApp(appId)

            return
        }

        const activeZIndex =
            Math.max(
                ...Object
                    .values(windows)
                    .filter(
                        (item) =>
                            item?.open &&
                            !item?.minimized,
                    )
                    .map(
                        (item) =>
                            item.zIndex ??
                            0,
                    ),
                0,
            )

        const isActive =
            currentWindow.zIndex ===
            activeZIndex

        if (isActive) {
            minimizeApp(appId)

            return
        }

        focusApp(appId)
    }


    /* ----- MAXIMIZAR ----- */
    const toggleMaximizeApp = (
        appId,
    ) => {
        setWindows((previous) => ({
            ...previous,

            [appId]: {
                ...previous[appId],

                maximized:
                    !previous[appId]
                        ?.maximized,
            },
        }))
    }


    /* ----- FECHAR ----- */
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


    /* === CONTEÚDO DOS APPS === */
    const renderAppContent = (
        appId,
    ) => {
        switch (appId) {
            case 'about':
                return <About />

            case 'projects':
                return (
                    <Projects
                        onOpenProject={
                            openProject
                        }
                    />
                )

            case 'technologies':
                return (
                    <Technologies />
                )

            case 'contact':
                return <Contact />

            case 'resume':
                return <Resume />

            case 'terminal':
                return (
                    <Terminal
                        onOpenApp={
                            openApp
                        }
                    />
                )

            case 'stats':
                return <Stats />

            default:
                if (
                    appId.startsWith(
                        'project-',
                    )
                ) {
                    const projectId =
                        appId.replace(
                            'project-',
                            '',
                        )

                    const project =
                        projectsData.find(
                            (item) =>
                                item.id ===
                                projectId,
                        )

                    return (
                        <ProjectDemo
                            project={
                                project
                            }
                        />
                    )
                }

                return (
                    <p>
                        Aplicativo em
                        desenvolvimento.
                    </p>
                )
        }
    }


    /* === RENDERIZAÇÃO === */
    return (
        <main className="desktop">
            <section className="desktop-shortcuts">
                {apps
                    .filter(
                        (app) =>
                            app.desktop,
                    )
                    .map((app) => {
                        const Icon =
                            app.icon

                        return (
                            <button
                                key={app.id}
                                className="shortcut"
                                type="button"
                                data-app-id={
                                    app.id
                                }
                                onClick={() =>
                                    openApp(
                                        app.id,
                                    )
                                }
                                aria-label={
                                    `Abrir ${app.name}`
                                }
                                title={
                                    app.name
                                }
                            >
                                <span className="shortcut-icon">
                                    <Icon
                                        size={30}
                                        strokeWidth={1.8}
                                    />
                                </span>

                                <span className="shortcut-name">
                                    {
                                        app.name
                                    }
                                </span>
                            </button>
                        )
                    })}
            </section>

            {allApps.map((app) => {
                const windowState =
                    windows[app.id]

                if (
                    !windowState?.open
                ) {
                    return null
                }

                const activeZIndex =
                    Math.max(
                        ...Object
                            .values(windows)
                            .filter(
                                (item) =>
                                    item?.open &&
                                    !item?.minimized,
                            )
                            .map(
                                (item) =>
                                    item.zIndex ??
                                    0,
                            ),
                        0,
                    )

                const isActive =
                    !windowState.minimized &&
                    windowState.zIndex ===
                    activeZIndex

                return (
                    <Window
                        key={app.id}
                        hidden={
                            windowState.minimized
                        }
                        title={
                            app.name
                        }
                        active={
                            isActive
                        }
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
                            focusApp(
                                app.id,
                            )
                        }
                        onPositionChange={(
                            position,
                        ) =>
                            moveApp(
                                app.id,
                                position,
                            )
                        }
                        onSizeChange={(
                            size,
                        ) =>
                            resizeApp(
                                app.id,
                                size,
                            )
                        }
                        onClose={() =>
                            closeApp(
                                app.id,
                            )
                        }
                        onMinimize={() =>
                            minimizeApp(
                                app.id,
                            )
                        }
                        onMaximize={() =>
                            toggleMaximizeApp(
                                app.id,
                            )
                        }
                    >
                        {
                            app.id ===
                                'game'
                                ? (
                                    <Game
                                        isActive={
                                            isActive
                                        }
                                    />
                                )
                                : renderAppContent(
                                    app.id,
                                )
                        }
                    </Window>
                )
            })}

            <Taskbar
                theme={theme}
                toggleTheme={
                    toggleTheme
                }
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