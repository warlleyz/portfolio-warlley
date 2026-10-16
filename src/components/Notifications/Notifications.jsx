import { useLanguage } from '../../i18n/language'
import {
    Bell,
    CheckCheck,
    Trash2,
} from 'lucide-react'

import {
    useEffect,
    useRef,
} from 'react'

import Tooltip from '../Tooltip/Tooltip'

import './Notifications.css'


function Notifications({
    notifications,
    onClose,
    onClear,
    onOpenNotification,
}) {
    const { t } = useLanguage()

    /* === REFERÊNCIAS === */
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
    }, [
        onClose,
    ])


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
    }, [
        onClose,
    ])


    /* === RENDERIZAÇÃO === */
    return (
        <aside
            ref={
                panelRef
            }
            className="notifications-panel"
            aria-label={t("Notificações")}
        >
            {/* === CABEÇALHO === */}
            <header className="notifications-header">
                <div>
                    <span className="notifications-label">
                        WS OS
                    </span>

                    <h2 className="notifications-title">{t("Notificações")}</h2>
                </div>

                {notifications.length > 0 && (
                    <Tooltip
                        text={t("Limpar")}
                        position="bottom"
                    >
                        <button
                            className="notifications-clear"
                            type="button"
                            onClick={
                                onClear
                            }
                            aria-label={t("Limpar")}
                        >
                            <Trash2
                                size={15}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </button>
                    </Tooltip>
                )}
            </header>


            {/* === CONTEÚDO === */}
            <div className="notifications-content">
                {
                    notifications.length > 0
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
                                        .filter(Boolean)
                                        .join(' ')

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
                                                    ? `Abrir ${t(notification.title)}`
                                                    : notification.title
                                            }
                                        >
                                            {/* ----- ÍCONE ----- */}
                                            <div className="notification-icon">
                                                <Icon
                                                    size={17}
                                                    strokeWidth={1.8}
                                                    aria-hidden="true"
                                                />
                                            </div>


                                            {/* ----- TEXTO ----- */}
                                            <div className="notification-text">
                                                <div className="notification-title-row">
                                                    <strong>
                                                        {t(notification.title)}
                                                    </strong>

                                                    {!notification.read && (
                                                        <span
                                                            className="notification-unread-dot"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>

                                                <span>
                                                    {t(notification.description)}
                                                </span>

                                                {notification.time && (
                                                    <small>
                                                        {
                                                            t(notification.time)
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
                                        aria-hidden="true"
                                    />
                                </span>

                                <strong>{t("Tudo em dia")}</strong>

                                <span>{t("Nenhuma notificação no momento.")}</span>
                            </div>
                        )
                }
            </div>
        </aside>
    )
}

export default Notifications