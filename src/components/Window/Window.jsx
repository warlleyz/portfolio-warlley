import { useRef } from 'react'
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
    position,
    onPositionChange,
    zIndex = 10,
    onFocus,
}) {
    const windowRef = useRef(null)

    const handleDragStart = (event) => {
        if (maximized) {
            return
        }

        if (event.button !== 0) {
            return
        }

        const windowElement = windowRef.current

        if (!windowElement) {
            return
        }

        onFocus?.()

        const rect = windowElement.getBoundingClientRect()

        const offsetX = event.clientX - rect.left
        const offsetY = event.clientY - rect.top

        windowElement.classList.add('window-dragging')

        const handlePointerMove = (moveEvent) => {
            const maxX = Math.max(
                window.innerWidth - rect.width,
                0,
            )

            const maxY = Math.max(
                window.innerHeight - rect.height,
                0,
            )

            const x = Math.min(
                Math.max(moveEvent.clientX - offsetX, 0),
                maxX,
            )

            const y = Math.min(
                Math.max(moveEvent.clientY - offsetY, 0),
                maxY,
            )

            // Movimento direto no DOM.
            // Não causa re-render do React.
            windowElement.style.left = '0px'
            windowElement.style.top = '0px'
            windowElement.style.translate = `${x}px ${y}px`
        }

        const handlePointerUp = () => {
            const finalRect =
                windowElement.getBoundingClientRect()

            const x = finalRect.left
            const y = finalRect.top

            windowElement.classList.remove('window-dragging')

            onPositionChange?.({
                x,
                y,
            })

            window.removeEventListener(
                'pointermove',
                handlePointerMove,
            )

            window.removeEventListener(
                'pointerup',
                handlePointerUp,
            )
        }

        window.addEventListener(
            'pointermove',
            handlePointerMove,
        )

        window.addEventListener(
            'pointerup',
            handlePointerUp,
        )
    }

    return (
        <div
            ref={windowRef}
            className={`window
        ${maximized ? 'window-maximized' : ''}
        ${minimizing ? 'window-minimizing' : ''}
        ${closing ? 'window-closing' : ''}
      `}
            style={{
                zIndex,

                ...(!maximized && position
                    ? {
                        left: '0px',
                        top: '0px',
                        translate: `${position.x}px ${position.y}px`,
                    }
                    : {}),
            }}
            onMouseDown={onFocus}
        >
            <div
                className="window-header"
                onPointerDown={handleDragStart}
            >
                <span className="window-title">
                    {title}
                </span>

                <div
                    className="window-controls"
                    onPointerDown={(event) =>
                        event.stopPropagation()
                    }
                >
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
                        aria-label={
                            maximized
                                ? 'Restaurar'
                                : 'Maximizar'
                        }
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