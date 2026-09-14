import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import './Taskbar.css'

function Taskbar() {
    const [dateTime, setDateTime] = useState(new Date())
    const [darkMode, setDarkMode] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const toggleTheme = () => {
        setDarkMode((previous) => !previous)
    }

    const time = dateTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    })

    const date = dateTime.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })

    return (
        <footer className="taskbar">
            <div className="taskbar-apps"></div>

            <div className="taskbar-system">
                <button
                    className="theme-button"
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Alterar tema"
                >
                    {darkMode ? (
                        <Sun size={20} strokeWidth={1.8} />
                    ) : (
                        <Moon size={20} strokeWidth={1.8} />
                    )}
                </button>

                <div className="taskbar-clock">
                    <span>{time}</span>
                    <span>{date}</span>
                </div>
            </div>
        </footer>
    )
}

export default Taskbar