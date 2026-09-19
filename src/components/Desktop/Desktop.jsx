import {
    useRef,
    useState,
} from 'react'

import {
    Bell,
    FileText,
    Folder,
    Mail,
} from 'lucide-react'

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
import Notifications from '../Notifications/Notifications'

import './Desktop.css'


/* === APLICATIVOS === */

/* ----- APPS PRINCIPAIS ----- */
const apps =
    appsData


/* ----- PROJETOS ----- */
const projectApps =
    projectsData.map(
        (project) => ({
            id:
                `project-${project.id}`,

            projectId:
                project.id,

            name:
                project.title,

            icon:
                project.icon,
        }),
    )


/* ----- TODOS OS APPS ----- */
const allApps = [
    ...apps,
    ...projectApps,
]


function Desktop({
    theme,
    toggleTheme,
}) {
    /* === JANELAS === */
    const [
        windows,
        setWindows,
    ] = useState({})


    /* === PAINÉIS === */
    const [
        menuOpen,
        setMenuOpen,
    ] = useState(false)

    const [
        quickControlsOpen,
        setQuickControlsOpen,
    ] = useState(false)

    const [
        notificationsOpen,
        setNotificationsOpen,
    ] = useState(false)


    /* === CONTROLES VISUAIS === */
    const [
        brightness,
        setBrightness,
    ] = useState(100)

    const [
        glassOpacity,
        setGlassOpacity,
    ] = useState(78)


    /* === NOTIFICAÇÕES === */
    const [
        notifications,
        setNotifications,
    ] = useState([
        {
            id:
                'welcome',

            icon:
                Bell,

            title:
                'Bem-vindo ao WS OS',

            description:
                'Explore meus projetos, tecnologias e experiências pelo sistema.',

            appId:
                null,

            time:
                'Agora',

            read:
                false,
        },
    ])


    /* === DESKTOP === */
    const [
        selectedShortcut,
        setSelectedShortcut,
    ] = useState(null)

    const topZIndex =
        useRef(10)


    /* === GERENCIAMENTO DE NOTIFICAÇÕES === */

    /* ----- ADICIONAR ----- */
    const addNotification = ({
        id,
        icon,
        title,
        description,
        appId = null,
    }) => {
        setNotifications(
            (previous) => {
                const alreadyExists =
                    previous.some(
                        (notification) =>
                            notification.id ===
                            id,
                    )

                if (alreadyExists) {
                    return previous
                }

                const currentTime =
                    new Date()
                        .toLocaleTimeString(
                            'pt-BR',
                            {
                                hour:
                                    '2-digit',

                                minute:
                                    '2-digit',
                            },
                        )

                return [
                    {
                        id,
                        icon,
                        title,
                        description,
                        appId,

                        time:
                            currentTime,

                        read:
                            false,
                    },

                    ...previous,
                ]
            },
        )
    }


    /* ----- LIMPAR ----- */
    const clearNotifications =
        () => {
            setNotifications([])
        }


    /* ----- NÃO LIDAS ----- */
    const unreadNotifications =
        notifications.filter(
            (notification) =>
                !notification.read,
        ).length


    /* === JANELAS === */

    /* ----- PRÓXIMO Z-INDEX ----- */
    const getNextZIndex =
        () => {
            topZIndex.current +=
                1

            return (
                topZIndex.current
            )
        }


    /* ----- FOCO ----- */
    const focusApp = (
        appId,
    ) => {
        const nextZIndex =
            getNextZIndex()

        setWindows(
            (previous) => ({
                ...previous,

                [appId]: {
                    ...previous[
                    appId
                    ],

                    zIndex:
                        nextZIndex,
                },
            }),
        )
    }


    /* ----- ABRIR ----- */
    const openApp = (
        appId,
    ) => {
        const nextZIndex =
            getNextZIndex()

        setWindows(
            (previous) => {
                const currentWindow =
                    previous[
                    appId
                    ]

                const app =
                    appsData.find(
                        (item) =>
                            item.id ===
                            appId,
                    )

                let initialSize =
                    currentWindow
                        ?.size ??
                    null

                let initialPosition =
                    currentWindow
                        ?.position ??
                    null


                /* ----- CONFIGURAÇÃO PERSONALIZADA ----- */
                if (
                    app?.window &&
                    !currentWindow
                        ?.size
                ) {
                    const width =
                        Math.min(
                            app.window
                                .width,

                            window
                                .innerWidth -
                            80,
                        )

                    const height =
                        Math.min(
                            app.window
                                .height,

                            window
                                .innerHeight -
                            80,
                        )

                    initialSize = {
                        width,
                        height,
                    }


                    /* ----- CENTRALIZAR ----- */
                    if (
                        app.window
                            .centered
                    ) {
                        initialPosition = {
                            x:
                                Math.max(
                                    (
                                        window
                                            .innerWidth -
                                        width
                                    ) / 2,
                                    8,
                                ),

                            y:
                                Math.max(
                                    (
                                        window
                                            .innerHeight -
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

                        open:
                            true,

                        minimized:
                            false,

                        minimizing:
                            false,

                        closing:
                            false,

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
            },
        )


        /* === NOTIFICAÇÕES DE APPS === */

        /* ----- CURRÍCULO ----- */
        if (
            appId ===
            'resume'
        ) {
            addNotification({
                id:
                    'resume-opened',

                icon:
                    FileText,

                title:
                    'Currículo aberto',

                description:
                    'Meu currículo está disponível para consulta no WS OS.',

                appId:
                    'resume',
            })
        }


        /* ----- CONTATO ----- */
        if (
            appId ===
            'contact'
        ) {
            addNotification({
                id:
                    'contact-opened',

                icon:
                    Mail,

                title:
                    'Contato disponível',

                description:
                    'Você pode usar esta área para entrar em contato comigo.',

                appId:
                    'contact',
            })
        }
    }


    /* ----- ABRIR PROJETO ----- */
    const openProject = (
        project,
    ) => {
        const appId =
            `project-${project.id}`

        openApp(
            appId,
        )

        addNotification({
            id:
                appId,

            icon:
                Folder,

            title:
                project.title,

            description:
                'Projeto aberto no WS OS.',

            appId,
        })
    }


    /* ----- MOVIMENTO ----- */
    const moveApp = (
        appId,
        position,
    ) => {
        setWindows(
            (previous) => ({
                ...previous,

                [appId]: {
                    ...previous[
                    appId
                    ],

                    position,
                },
            }),
        )
    }


    /* ----- REDIMENSIONAMENTO ----- */
    const resizeApp = (
        appId,
        size,
    ) => {
        setWindows(
            (previous) => ({
                ...previous,

                [appId]: {
                    ...previous[
                    appId
                    ],

                    size,
                },
            }),
        )
    }


    /* ----- MINIMIZAR ----- */
    const minimizeApp = (
        appId,
    ) => {
        setWindows(
            (previous) => ({
                ...previous,

                [appId]: {
                    ...previous[
                    appId
                    ],

                    minimizing:
                        true,
                },
            }),
        )

        setTimeout(
            () => {
                setWindows(
                    (previous) => ({
                        ...previous,

                        [appId]: {
                            ...previous[
                            appId
                            ],

                            minimized:
                                true,

                            minimizing:
                                false,
                        },
                    }),
                )
            },
            200,
        )
    }


    /* ----- RESTAURAR ----- */
    const restoreApp = (
        appId,
    ) => {
        const nextZIndex =
            getNextZIndex()

        setWindows(
            (previous) => ({
                ...previous,

                [appId]: {
                    ...previous[
                    appId
                    ],

                    minimized:
                        false,

                    zIndex:
                        nextZIndex,
                },
            }),
        )
    }


    /* ----- MAXIMIZAR ----- */
    const toggleMaximizeApp = (
        appId,
    ) => {
        const nextZIndex =
            getNextZIndex()

        setWindows(
            (previous) => ({
                ...previous,

                [appId]: {
                    ...previous[
                    appId
                    ],

                    maximized:
                        !previous[
                            appId
                        ]?.maximized,

                    zIndex:
                        nextZIndex,
                },
            }),
        )
    }


    /* ----- FECHAR ----- */
    const closeApp = (
        appId,
    ) => {
        setWindows(
            (previous) => ({
                ...previous,

                [appId]: {
                    ...previous[
                    appId
                    ],

                    closing:
                        true,
                },
            }),
        )

        setTimeout(
            () => {
                setWindows(
                    (previous) => ({
                        ...previous,

                        [appId]: {
                            ...previous[
                            appId
                            ],

                            open:
                                false,

                            minimized:
                                false,

                            maximized:
                                false,

                            minimizing:
                                false,

                            closing:
                                false,
                        },
                    }),
                )
            },
            200,
        )
    }


    /* === ESTADO DO DESKTOP === */

    /* ----- APP ATIVO ----- */
    const activeZIndex =
        Math.max(
            ...Object
                .values(
                    windows,
                )
                .filter(
                    (item) =>
                        item?.open &&
                        !item
                            ?.minimized,
                )
                .map(
                    (item) =>
                        item.zIndex ??
                        0,
                ),

            0,
        )


    const activeAppId =
        Object
            .entries(
                windows,
            )
            .find(
                ([
                    ,
                    windowState,
                ]) =>
                    windowState
                        ?.open &&

                    !windowState
                        ?.minimized &&

                    windowState
                        .zIndex ===
                    activeZIndex,
            )?.[0] ??
        null


    /* ----- SELEÇÃO DE ATALHO ----- */
    const handleShortcutClick = (
        appId,
    ) => {
        setSelectedShortcut(
            appId,
        )

        openApp(
            appId,
        )
    }


    /* ----- CLIQUE NO FUNDO ----- */
    const handleDesktopClick = (
        event,
    ) => {
        if (
            event.target.closest(
                '.shortcut, .window, .taskbar, .ws-menu, .quick-controls, .notifications-panel',
            )
        ) {
            return
        }

        setSelectedShortcut(
            null,
        )
    }


    /* === WS MENU === */

    /* ----- ALTERNAR ----- */
    const toggleMenu =
        () => {
            setMenuOpen(
                (previous) =>
                    !previous,
            )

            setQuickControlsOpen(
                false,
            )

            setNotificationsOpen(
                false,
            )
        }


    /* ----- FECHAR ----- */
    const closeMenu =
        () => {
            setMenuOpen(
                false,
            )
        }


    /* ----- ABRIR PELO MENU ----- */
    const openAppFromMenu = (
        appId,
    ) => {
        const currentWindow =
            windows[
            appId
            ]

        if (
            currentWindow?.open
        ) {
            if (
                currentWindow
                    .minimized
            ) {
                restoreApp(
                    appId,
                )
            } else {
                focusApp(
                    appId,
                )
            }
        } else {
            openApp(
                appId,
            )
        }

        setSelectedShortcut(
            appId,
        )

        setMenuOpen(
            false,
        )
    }


    /* === CONTROLES RÁPIDOS === */

    /* ----- ALTERNAR ----- */
    const toggleQuickControls =
        () => {
            setQuickControlsOpen(
                (previous) =>
                    !previous,
            )

            setMenuOpen(
                false,
            )

            setNotificationsOpen(
                false,
            )
        }


    /* ----- FECHAR ----- */
    const closeQuickControls =
        () => {
            setQuickControlsOpen(
                false,
            )
        }


    /* === PAINEL DE NOTIFICAÇÕES === */

    /* ----- ALTERNAR ----- */
    const toggleNotifications =
        () => {
            setNotificationsOpen(
                (previous) => {
                    const next =
                        !previous

                    if (next) {
                        setNotifications(
                            (current) =>
                                current.map(
                                    (
                                        notification,
                                    ) => ({
                                        ...notification,

                                        read:
                                            true,
                                    }),
                                ),
                        )
                    }

                    return next
                },
            )

            setMenuOpen(
                false,
            )

            setQuickControlsOpen(
                false,
            )
        }


    /* ----- FECHAR ----- */
    const closeNotifications =
        () => {
            setNotificationsOpen(
                false,
            )
        }


    /* ----- ABRIR PELA NOTIFICAÇÃO ----- */
    const openNotification = (
        notification,
    ) => {
        if (
            !notification.appId
        ) {
            return
        }

        const currentWindow =
            windows[
            notification.appId
            ]

        if (
            currentWindow?.open
        ) {
            if (
                currentWindow
                    .minimized
            ) {
                restoreApp(
                    notification.appId,
                )
            } else {
                focusApp(
                    notification.appId,
                )
            }
        } else {
            openApp(
                notification.appId,
            )
        }

        setSelectedShortcut(
            notification.appId,
        )

        setNotificationsOpen(
            false,
        )
    }


    /* === TASKBAR === */

    /* ----- ALTERNAR APP ----- */
    const toggleTaskbarApp = (
        appId,
    ) => {
        const currentWindow =
            windows[
            appId
            ]

        if (
            !currentWindow
        ) {
            return
        }

        if (
            currentWindow
                .minimized
        ) {
            restoreApp(
                appId,
            )

            return
        }

        const isActive =
            activeAppId ===
            appId

        if (
            isActive
        ) {
            minimizeApp(
                appId,
            )

            return
        }

        focusApp(
            appId,
        )
    }


    /* === CONTEÚDO DOS APPS === */
    const renderAppContent = (
        appId,
    ) => {
        switch (
        appId
        ) {
            case 'about':
                return (
                    <About />
                )

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
                return (
                    <Contact />
                )

            case 'resume':
                return (
                    <Resume />
                )

            case 'terminal':
                return (
                    <Terminal
                        onOpenApp={
                            openApp
                        }
                    />
                )

            case 'stats':
                return (
                    <Stats />
                )

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

                    if (
                        !project
                    ) {
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
            {/* === ATALHOS === */}
            <section
                className="desktop-shortcuts"
                aria-label="Aplicativos"
            >
                {apps
                    .filter(
                        (app) =>
                            app.desktop,
                    )
                    .map(
                        (app) => {
                            const Icon =
                                app.icon

                            const windowState =
                                windows[
                                app.id
                                ]

                            const isOpen =
                                Boolean(
                                    windowState
                                        ?.open,
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
                                .filter(
                                    Boolean,
                                )
                                .join(
                                    ' ',
                                )

                            return (
                                <button
                                    key={
                                        app.id
                                    }
                                    className={
                                        shortcutClassName
                                    }
                                    type="button"
                                    data-app-id={
                                        app.id
                                    }
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
                        },
                    )}
            </section>


            {/* === JANELAS === */}
            {allApps.map(
                (app) => {
                    const windowState =
                        windows[
                        app.id
                        ]

                    if (
                        !windowState
                            ?.open
                    ) {
                        return null
                    }

                    const isActive =
                        !windowState
                            .minimized &&

                        activeAppId ===
                        app.id

                    return (
                        <Window
                            key={
                                app.id
                            }
                            hidden={
                                windowState
                                    .minimized
                            }
                            title={
                                app.name
                            }
                            active={
                                isActive
                            }
                            maximized={
                                windowState
                                    .maximized
                            }
                            minimizing={
                                windowState
                                    .minimizing
                            }
                            closing={
                                windowState
                                    .closing
                            }
                            position={
                                windowState
                                    .position
                            }
                            size={
                                windowState
                                    .size
                            }
                            zIndex={
                                windowState
                                    .zIndex
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
                },
            )}


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


            {/* === NOTIFICAÇÕES === */}
            {notificationsOpen && (
                <Notifications
                    notifications={
                        notifications
                    }
                    onClose={
                        closeNotifications
                    }
                    onClear={
                        clearNotifications
                    }
                    onOpenNotification={
                        openNotification
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
                notificationsOpen={
                    notificationsOpen
                }
                onToggleNotifications={
                    toggleNotifications
                }
                notificationCount={
                    unreadNotifications
                }
            />
        </main>
    )
}

export default Desktop