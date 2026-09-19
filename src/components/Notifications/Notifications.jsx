import {
    Bell,
    CheckCheck,
    Trash2,
} from 'lucide-react'

import {
    useEffect,
    useRef,
} from 'react'

import './Notifications.css'


function Notifications({
    notifications,
    onClose,
    onClear,
    onOpenNotification,
}) {
    const panelRef =
        useRef(null)


    /* === FECHAR COM ESC === */
    useEffect(() => {
        const handleKeyDown = (
            event,
        ) => {
            if (
                event.key ===
                'Escape'
            ) {
                onClose()
            }
        }

        window.addEventListener(
            'keydown',
            handleKeyDown,
        )

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        }
    }, [onClose])


    /* === FECHAR AO CLICAR FORA === */
    useEffect(() => {
        const handleMouseDown = (
            event,
        ) => {
            if (
                event.target.closest(
                    '.taskbar-notifications-button',
                )
            ) {
                return
            }

            if (
                panelRef.current &&
                !panelRef.current.contains(
                    event.target,
                )
            ) {
                onClose()
            }
        }

        document.addEventListener(
            'mousedown',
            handleMouseDown,
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handleMouseDown,
            )
        }
    }, [onClose])


    /* === RENDERIZAÇÃO === */
    return (
        <aside
            ref={
                panelRef
            }
            className="notifications-panel"
            aria-label="Notificações"
        >
            {/* === CABEÇALHO === */}
            <header className="notifications-header">
                <div>
                    <span className="notifications-label">
                        WS OS
                    </span>

                    <h2 className="notifications-title">
                        Notificações
                    </h2>
                </div>


                {/* ----- LIMPAR ----- */}
                {notifications.length > 0 && (
                    <button
                        className="notifications-clear"
                        type="button"
                        onClick={
                            onClear
                        }
                        aria-label="Limpar notificações"
                        title="Limpar notificações"
                    >
                        <Trash2
                            size={15}
                            strokeWidth={1.8}
                        />
                    </button>
                )}
            </header>


            {/* === CONTEÚDO === */}
            <div className="notifications-content">
                {notifications.length > 0
                    ? (
                        notifications.map(
                            (
                                notification,
                            ) => {
                                const Icon =
                                    notification.icon ??
                                    Bell

                                const isActionable =
                                    Boolean(
                                        notification.appId,
                                    )

                                const className = [
                                    'notification-item',

                                    notification.read
                                        ? 'notification-read'
                                        : 'notification-unread',

                                    isActionable
                                        ? 'notification-action'
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
                                            notification.id
                                        }
                                        className={
                                            className
                                        }
                                        type="button"
                                        onClick={() => {
                                            if (
                                                !isActionable
                                            ) {
                                                return
                                            }

                                            onOpenNotification(
                                                notification,
                                            )
                                        }}
                                        disabled={
                                            !isActionable
                                        }
                                        aria-label={
                                            isActionable
                                                ? `Abrir ${notification.title}`
                                                : notification.title
                                        }
                                    >
                                        {/* ----- ÍCONE ----- */}
                                        <div className="notification-icon">
                                            <Icon
                                                size={17}
                                                strokeWidth={1.8}
                                            />
                                        </div>


                                        {/* ----- TEXTO ----- */}
                                        <div className="notification-text">
                                            <div className="notification-title-row">
                                                <strong>
                                                    {
                                                        notification.title
                                                    }
                                                </strong>

                                                {!notification.read && (
                                                    <span
                                                        className="notification-unread-dot"
                                                        aria-label="Não lida"
                                                    />
                                                )}
                                            </div>


                                            <span>
                                                {
                                                    notification.description
                                                }
                                            </span>


                                            {notification.time && (
                                                <small>
                                                    {
                                                        notification.time
                                                    }
                                                </small>
                                            )}
                                        </div>
                                    </button>
                                )
                            },
                        )
                    )
                    : (
                        <div className="notifications-empty">
                            <span className="notifications-empty-icon">
                                <CheckCheck
                                    size={22}
                                    strokeWidth={1.7}
                                />
                            </span>

                            <strong>
                                Tudo em dia
                            </strong>

                            <span>
                                Nenhuma notificação no momento.
                            </span>
                        </div>
                    )}
            </div>
        </aside>
    )
}

export default Notifications