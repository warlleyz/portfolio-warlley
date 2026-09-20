import {
    useEffect,
    useState,
} from 'react'

import {
    Bell,
    Moon,
    SlidersHorizontal,
    Sun,
} from 'lucide-react'

import Tooltip from '../Tooltip/Tooltip'
import WeatherWidget from './WeatherWidget'

import './Taskbar.css'


function Taskbar({
    theme,
    toggleTheme,

    apps,
    windows,
    toggleTaskbarApp,

    menuOpen,
    onToggleMenu,

    quickControlsOpen,
    onToggleQuickControls,

    notificationsOpen,
    onToggleNotifications,
    notificationCount,
}) {
    const [
        dateTime,
        setDateTime,
    ] = useState(
        () => new Date(),
    )


    /* === RELÓGIO === */
    useEffect(() => {
        let minuteInterval = null

        const now =
            new Date()

        const millisecondsUntilNextMinute =
            (
                60 -
                now.getSeconds()
            ) * 1000 -
            now.getMilliseconds()

        const minuteTimeout =
            setTimeout(
                () => {
                    setDateTime(
                        new Date(),
                    )

                    minuteInterval =
                        setInterval(
                            () => {
                                setDateTime(
                                    new Date(),
                                )
                            },
                            60 * 1000,
                        )
                },
                millisecondsUntilNextMinute,
            )

        return () => {
            clearTimeout(
                minuteTimeout,
            )

            if (
                minuteInterval
            ) {
                clearInterval(
                    minuteInterval,
                )
            }
        }
    }, [])


    /* === DATA E HORA === */
    const time =
        dateTime.toLocaleTimeString(
            'pt-BR',
            {
                hour:
                    '2-digit',

                minute:
                    '2-digit',
            },
        )

    const date =
        dateTime.toLocaleDateString(
            'pt-BR',
            {
                day:
                    '2-digit',

                month:
                    '2-digit',

                year:
                    'numeric',
            },
        )


    /* === APP ATIVO === */
    const activeZIndex =
        Math.max(
            ...Object
                .values(
                    windows,
                )
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


    /* === ACESSIBILIDADE === */
    const notificationLabel =
        notificationCount > 0
            ? notificationsOpen
                ? `Fechar notificações. ${notificationCount} não lidas.`
                : `Abrir notificações. ${notificationCount} não lidas.`
            : notificationsOpen
                ? 'Fechar notificações'
                : 'Abrir notificações'


    /* === RENDERIZAÇÃO === */
    return (
        <footer
            className="taskbar"
            aria-label="Barra de tarefas"
        >
            <div className="taskbar-main">

                {/* === WS MENU === */}
                <Tooltip
                    text="WS Menu"
                    position="top"
                >
                    <button
                        className={[
                            'taskbar-button',
                            'taskbar-menu-button',

                            menuOpen
                                ? 'taskbar-menu-button-active'
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        type="button"
                        onClick={
                            onToggleMenu
                        }
                        aria-label={
                            menuOpen
                                ? 'Fechar WS Menu'
                                : 'Abrir WS Menu'
                        }
                        aria-expanded={
                            menuOpen
                        }
                    >
                        <span className="taskbar-menu-logo">
                            WS
                        </span>
                    </button>
                </Tooltip>


                <span
                    className="taskbar-divider"
                    aria-hidden="true"
                />


                {/* === APPS ABERTOS === */}
                <div
                    className="taskbar-apps"
                    aria-label="Aplicativos abertos"
                >
                    {apps.map(
                        (app) => {
                            const windowState =
                                windows[
                                app.id
                                ]

                            if (
                                !windowState?.open
                            ) {
                                return null
                            }

                            const isActive =
                                !windowState.minimized &&
                                windowState.zIndex ===
                                activeZIndex

                            const Icon =
                                app.icon

                            const className = [
                                'taskbar-app',

                                isActive
                                    ? 'taskbar-app-active'
                                    : '',

                                windowState.minimized
                                    ? 'taskbar-app-minimized'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')

                            return (
                                <Tooltip
                                    key={
                                        app.id
                                    }
                                    text={
                                        app.name
                                    }
                                    position="top"
                                >
                                    <button
                                        type="button"
                                        className={
                                            className
                                        }
                                        onClick={() =>
                                            toggleTaskbarApp(
                                                app.id,
                                            )
                                        }
                                        aria-label={
                                            windowState.minimized
                                                ? `Restaurar ${app.name}`
                                                : isActive
                                                    ? `Minimizar ${app.name}`
                                                    : `Focar ${app.name}`
                                        }
                                    >
                                        <span className="taskbar-app-icon">
                                            <Icon
                                                size={19}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <span
                                            className="taskbar-app-state"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </Tooltip>
                            )
                        },
                    )}
                </div>


                <span
                    className="taskbar-divider"
                    aria-hidden="true"
                />


                {/* === SISTEMA === */}
                <div className="taskbar-system">

                    {/* ----- CONTROLES RÁPIDOS ----- */}
                    <Tooltip
                        text="Controles rápidos"
                        position="top"
                    >
                        <button
                            className={[
                                'taskbar-button',
                                'taskbar-quick-controls-button',

                                quickControlsOpen
                                    ? 'taskbar-button-active'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            type="button"
                            onClick={
                                onToggleQuickControls
                            }
                            aria-label={
                                quickControlsOpen
                                    ? 'Fechar controles rápidos'
                                    : 'Abrir controles rápidos'
                            }
                            aria-expanded={
                                quickControlsOpen
                            }
                        >
                            <SlidersHorizontal
                                size={17}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </button>
                    </Tooltip>


                    {/* ----- NOTIFICAÇÕES ----- */}
                    <Tooltip
                        text="Notificações"
                        position="top"
                    >
                        <button
                            className={[
                                'taskbar-button',
                                'taskbar-notifications-button',

                                notificationsOpen
                                    ? 'taskbar-button-active'
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            type="button"
                            onClick={
                                onToggleNotifications
                            }
                            aria-label={
                                notificationLabel
                            }
                            aria-expanded={
                                notificationsOpen
                            }
                        >
                            <Bell
                                size={17}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            {notificationCount > 0 && (
                                <span
                                    className="taskbar-notification-badge"
                                    aria-hidden="true"
                                >
                                    {
                                        notificationCount > 9
                                            ? '9+'
                                            : notificationCount
                                    }
                                </span>
                            )}
                        </button>
                    </Tooltip>


                    {/* ----- TEMA ----- */}
                    <Tooltip
                        text={
                            theme === 'dark'
                                ? 'Tema claro'
                                : 'Tema escuro'
                        }
                        position="top"
                    >
                        <button
                            className="taskbar-button"
                            type="button"
                            onClick={
                                toggleTheme
                            }
                            aria-label={
                                theme === 'dark'
                                    ? 'Ativar tema claro'
                                    : 'Ativar tema escuro'
                            }
                        >
                            {
                                theme === 'dark'
                                    ? (
                                        <Sun
                                            size={17}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    )
                                    : (
                                        <Moon
                                            size={17}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    )
                            }
                        </button>
                    </Tooltip>
                </div>


                <span
                    className="taskbar-system-divider"
                    aria-hidden="true"
                />


                {/* === STATUS === */}
                <div className="taskbar-status">
                    <WeatherWidget />

                    <Tooltip
                        text={
                            `${time} • ${date}`
                        }
                        position="top"
                    >
                        <div
                            className="taskbar-clock"
                            aria-label={
                                `${time}, ${date}`
                            }
                        >
                            <span className="taskbar-time">
                                {time}
                            </span>

                            <span className="taskbar-date">
                                {date}
                            </span>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </footer>
    )
}

export default Taskbar