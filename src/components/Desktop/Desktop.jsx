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
import WSMenu from '../WSMenu/WSMenu'
import QuickControls from '../QuickControls/QuickControls'

import './Desktop.css'


/* === APLICATIVOS === */

/* ----- APPS PRINCIPAIS ----- */
const apps = appsData


/* ----- PROJETOS ----- */
const projectApps =
    projectsData.map((project) => ({
        id:
            `project-${project.id}`,

        projectId:
            project.id,

        name:
            project.title,

        icon:
            project.icon,
    }))


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

    const [
        menuOpen,
        setMenuOpen,
    ] = useState(false)

    const [
        quickControlsOpen,
        setQuickControlsOpen,
    ] = useState(false)

    const [
        brightness,
        setBrightness,
    ] = useState(100)

    const [
        glassOpacity,
        setGlassOpacity,
    ] = useState(78)

    const [
        selectedShortcut,
        setSelectedShortcut,
    ] = useState(null)

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
                        window.innerHeight - 80,
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
                                8,
                            ),

                        y:
                            Math.max(
                                (
                                    window.innerHeight -
                                    height
                                ) / 2,
                                8,
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
    const minimizeApp = (
        appId,
    ) => {
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
    const restoreApp = (
        appId,
    ) => {
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


    /* ----- MAXIMIZAR ----- */
    const toggleMaximizeApp = (
        appId,
    ) => {
        const nextZIndex =
            getNextZIndex()

        setWindows((previous) => ({
            ...previous,

            [appId]: {
                ...previous[appId],

                maximized:
                    !previous[appId]
                        ?.maximized,

                zIndex:
                    nextZIndex,
            },
        }))
    }


    /* ----- FECHAR ----- */
    const closeApp = (
        appId,
    ) => {
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


    /* === ESTADO DO DESKTOP === */

    /* ----- APP ATIVO ----- */
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
                        item.zIndex ?? 0,
                ),
            0,
        )

    const activeAppId =
        Object
            .entries(windows)
            .find(
                ([, windowState]) =>
                    windowState?.open &&
                    !windowState?.minimized &&
                    windowState.zIndex ===
                    activeZIndex,
            )?.[0] ?? null


    /* ----- SELEÇÃO ----- */
    const handleShortcutClick = (
        appId,
    ) => {
        setSelectedShortcut(
            appId,
        )

        openApp(appId)
    }


    /* ----- CLIQUE NO FUNDO ----- */
    const handleDesktopClick = (
        event,
    ) => {
        if (
            event.target.closest(
                '.shortcut, .window, .taskbar, .ws-menu',
            )
        ) {
            return
        }

        setSelectedShortcut(null)
    }


    /* === WS MENU === */

    /* ----- ALTERNAR ----- */
    const toggleMenu = () => {
        setMenuOpen(
            (previous) =>
                !previous,
        )

        setQuickControlsOpen(false)
    }


    /* ----- FECHAR ----- */
    const closeMenu = () => {
        setMenuOpen(false)
    }


    /* ----- ABRIR APP PELO MENU ----- */
    const openAppFromMenu = (
        appId,
    ) => {
        const currentWindow =
            windows[appId]

        if (
            currentWindow?.open
        ) {
            if (
                currentWindow.minimized
            ) {
                restoreApp(appId)
            } else {
                focusApp(appId)
            }
        } else {
            openApp(appId)
        }

        setSelectedShortcut(
            appId,
        )

        setMenuOpen(false)
    }

    /* === CONTROLES RÁPIDOS === */

    /* ----- ALTERNAR ----- */
    const toggleQuickControls = () => {
        setQuickControlsOpen(
            (previous) =>
                !previous,
        )

        setMenuOpen(false)
    }


    /* ----- FECHAR ----- */
    const closeQuickControls = () => {
        setQuickControlsOpen(false)
    }

    /* === TASKBAR === */

    /* ----- ALTERNAR APP ----- */
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

        const isActive =
            activeAppId === appId

        if (isActive) {
            minimizeApp(appId)

            return
        }

        focusApp(appId)
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

                    if (!project) {
                        return (
                            <p>
                                Projeto não encontrado.
                            </p>
                        )
                    }

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
                        Aplicativo em desenvolvimento.
                    </p>
                )
        }
    }


    /* === RENDERIZAÇÃO === */
    return (
        <main
            className="desktop"
            onClick={
                handleDesktopClick
            }
            style={{
                filter:
                    `brightness(${brightness}%)`,

                '--runtime-glass-opacity':
                    `${glassOpacity}%`,
            }}
        >
            <section
                className="desktop-shortcuts"
                aria-label="Aplicativos"
            >
                {apps
                    .filter(
                        (app) =>
                            app.desktop,
                    )
                    .map((app) => {
                        const Icon =
                            app.icon

                        const windowState =
                            windows[app.id]

                        const isOpen =
                            Boolean(
                                windowState?.open,
                            )

                        const isActive =
                            activeAppId ===
                            app.id

                        const isSelected =
                            selectedShortcut ===
                            app.id

                        const shortcutClassName = [
                            'shortcut',

                            isOpen
                                ? 'shortcut-open'
                                : '',

                            isActive
                                ? 'shortcut-active'
                                : '',

                            isSelected
                                ? 'shortcut-selected'
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ')

                        return (
                            <button
                                key={app.id}
                                className={
                                    shortcutClassName
                                }
                                type="button"
                                onClick={() =>
                                    handleShortcutClick(
                                        app.id,
                                    )
                                }
                                aria-label={
                                    `Abrir ${app.name}`
                                }
                                aria-pressed={
                                    isSelected
                                }
                                title={
                                    app.name
                                }
                            >
                                <span className="shortcut-icon">
                                    <Icon
                                        size={28}
                                        strokeWidth={1.7}
                                    />

                                    <span
                                        className="shortcut-state"
                                        aria-hidden="true"
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

                const isActive =
                    !windowState.minimized &&
                    activeAppId ===
                    app.id

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


            {/* === WS MENU === */}
            {menuOpen && (
                <WSMenu
                    apps={
                        apps.filter(
                            (app) =>
                                app.menu,
                        )
                    }
                    windows={
                        windows
                    }
                    activeAppId={
                        activeAppId
                    }
                    onOpenApp={
                        openAppFromMenu
                    }
                    onClose={
                        closeMenu
                    }
                />
            )}

            {/* === CONTROLES RÁPIDOS === */}
            {quickControlsOpen && (
                <QuickControls
                    theme={
                        theme
                    }
                    toggleTheme={
                        toggleTheme
                    }
                    brightness={
                        brightness
                    }
                    setBrightness={
                        setBrightness
                    }
                    glassOpacity={
                        glassOpacity
                    }
                    setGlassOpacity={
                        setGlassOpacity
                    }
                    onClose={
                        closeQuickControls
                    }
                />
            )}

            {/* === TASKBAR === */}
            <Taskbar
                theme={
                    theme
                }
                toggleTheme={
                    toggleTheme
                }
                apps={
                    allApps
                }
                windows={
                    windows
                }
                toggleTaskbarApp={
                    toggleTaskbarApp
                }
                menuOpen={
                    menuOpen
                }
                onToggleMenu={
                    toggleMenu
                }
                quickControlsOpen={
                    quickControlsOpen
                }
                onToggleQuickControls={
                    toggleQuickControls
                }
            />
        </main>
    )
}

export default Desktop