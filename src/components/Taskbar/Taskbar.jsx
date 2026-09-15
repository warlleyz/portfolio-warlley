import { useEffect, useState } from 'react'
import WeatherWidget from './WeatherWidget'

import {
    Moon,
    Sun,
} from 'lucide-react'

import './Taskbar.css'

function Taskbar({
    theme,
    toggleTheme,
    apps,
    windows,
    toggleTaskbarApp,
}) {
    const [dateTime, setDateTime] = useState(
        new Date(),
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const time = dateTime.toLocaleTimeString(
        'pt-BR',
        {
            hour: '2-digit',
            minute: '2-digit',
        },
    )

    const date = dateTime.toLocaleDateString(
        'pt-BR',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        },
    )

    const activeZIndex =
        Math.max(
            ...Object.values(windows)
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

    return (
        <footer className="taskbar">
            <div className="taskbar-left">
                <button
                    className="theme-button"
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Alterar tema"
                    title="Alterar tema"
                >
                    {theme === 'dark' ? (
                        <Sun
                            size={20}
                            strokeWidth={1.8}
                        />
                    ) : (
                        <Moon
                            size={20}
                            strokeWidth={1.8}
                        />
                    )}
                </button>
            </div>

            <div className="taskbar-apps">
                {apps.map((app) => {
                    const windowState =
                        windows[app.id]

                    if (!windowState?.open) {
                        return null
                    }

                    const isActive =
                        !windowState.minimized &&
                        windowState.zIndex ===
                        activeZIndex

                    return (
                        <button
                            key={app.id}
                            type="button"
                            className={`taskbar-app ${isActive
                                    ? 'taskbar-app-active'
                                    : ''
                                }`}
                            onClick={() =>
                                toggleTaskbarApp(app.id)
                            }
                            aria-label={app.name}
                            title={app.name}
                        >
                            {app.icon}
                        </button>
                    )
                })}
            </div>

            <div className="taskbar-right">
                <div className="taskbar-right">
                    <WeatherWidget />
                </div>
                
                <div className="taskbar-clock">
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
            </div>
        </footer>
    )
}

export default Taskbar