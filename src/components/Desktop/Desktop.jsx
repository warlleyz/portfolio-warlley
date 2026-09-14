import './Desktop.css'
import Taskbar from '../Taskbar/Taskbar'

import {
    UserRound,
    Folder,
    Cpu,
    Mail,
    FileText,
    TerminalSquare,
} from 'lucide-react'

function Desktop({ theme, toggleTheme }) {
    const shortcuts = [
        {
            name: 'Sobre mim',
            icon: <UserRound size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Projetos',
            icon: <Folder size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Tecnologias',
            icon: <Cpu size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Contato',
            icon: <Mail size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Currículo',
            icon: <FileText size={30} strokeWidth={1.8} />,
        },
        {
            name: 'Terminal',
            icon: <TerminalSquare size={30} strokeWidth={1.8} />,
        },
    ]

    return (
        <main className="desktop">
            <section className="desktop-shortcuts">
                {shortcuts.map((shortcut) => (
                    <button
                        key={shortcut.name}
                        className="shortcut"
                        type="button"
                    >
                        <span className="shortcut-icon">
                            {shortcut.icon}
                        </span>

                        <span className="shortcut-name">
                            {shortcut.name}
                        </span>
                    </button>
                ))}
            </section>

            <Taskbar
                theme={theme}
                toggleTheme={toggleTheme}
            />
        </main>
    )
}

export default Desktop