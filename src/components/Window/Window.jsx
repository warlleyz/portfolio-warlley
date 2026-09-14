import {
    Minus,
    Square,
    X,
} from 'lucide-react'

import './Window.css'

function Window({
    title,
    children,
    onClose,
    onMinimize,
    onMaximize,
    maximized = false,
    minimizing = false,
    closing = false,
}) {
    return (
        <div
            className={`window
              ${maximized ? 'window-maximized' : ''}
              ${minimizing ? 'window-minimizing' : ''}
              ${closing ? 'window-closing' : ''}
            `}
        >
            <div className="window-header">
                <span className="window-title">{title}</span>

                <div className="window-controls">
                    <button
                        type="button"
                        onClick={onMinimize}
                        aria-label="Minimizar"
                    >
                        <Minus size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={onMaximize}
                        aria-label="Maximizar"
                    >
                        <Square size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="window-content">
                {children}
            </div>
        </div>
    )
}

export default Window