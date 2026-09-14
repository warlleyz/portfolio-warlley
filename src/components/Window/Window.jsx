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
    size,
    onSizeChange,
    zIndex = 10,
    onFocus,
}) {
    const windowRef = useRef(null)

    const handleResizeStart = (event, direction) => {
        if (maximized || event.button !== 0) {
            return
        }

        event.preventDefault()
        event.stopPropagation()

        const windowElement = windowRef.current

        if (!windowElement) {
            return
        }

        onFocus?.()

        const rect = windowElement.getBoundingClientRect()

        const startX = event.clientX
        const startY = event.clientY

        const startWidth = rect.width
        const startHeight = rect.height

        const minWidth = 420
        const minHeight = 280

        let currentWidth = startWidth
        let currentHeight = startHeight

        let animationFrame = null

        windowElement.classList.add('window-resizing')

        const handlePointerMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY

            if (direction.includes('right')) {
                currentWidth = Math.min(
                    Math.max(startWidth + deltaX, minWidth),
                    window.innerWidth,
                )
            }

            if (direction.includes('bottom')) {
                currentHeight = Math.min(
                    Math.max(startHeight + deltaY, minHeight),
                    window.innerHeight,
                )
            }

            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }

            animationFrame = requestAnimationFrame(() => {
                windowElement.style.width = `${currentWidth}px`
                windowElement.style.height = `${currentHeight}px`
            })
        }

        const finishResize = () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }

            windowElement.classList.remove('window-resizing')

            onSizeChange?.({
                width: currentWidth,
                height: currentHeight,
            })

            window.removeEventListener(
                'pointermove',
                handlePointerMove,
            )

            window.removeEventListener(
                'pointerup',
                finishResize,
            )

            window.removeEventListener(
                'pointercancel',
                finishResize,
            )
        }

        window.addEventListener(
            'pointermove',
            handlePointerMove,
        )

        window.addEventListener(
            'pointerup',
            finishResize,
        )

        window.addEventListener(
            'pointercancel',
            finishResize,
        )
    }

    const handleDragStart = (event) => {
        if (maximized || event.button !== 0) {
            return
        }

        const windowElement = windowRef.current

        if (!windowElement) {
            return
        }

        event.preventDefault()
        onFocus?.()

        const rect = windowElement.getBoundingClientRect()

        const offsetX = event.clientX - rect.left
        const offsetY = event.clientY - rect.top

        let currentX = rect.left
        let currentY = rect.top

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

            currentX = Math.min(
                Math.max(moveEvent.clientX - offsetX, 0),
                maxX,
            )

            currentY = Math.min(
                Math.max(moveEvent.clientY - offsetY, 0),
                maxY,
            )

            windowElement.style.left = '0px'
            windowElement.style.top = '0px'
            windowElement.style.translate =
                `${currentX}px ${currentY}px`
        }

        const finishDrag = () => {
            windowElement.classList.remove('window-dragging')

            onPositionChange?.({
                x: currentX,
                y: currentY,
            })

            window.removeEventListener(
                'pointermove',
                handlePointerMove,
            )

            window.removeEventListener(
                'pointerup',
                finishDrag,
            )

            window.removeEventListener(
                'pointercancel',
                finishDrag,
            )
        }

        window.addEventListener(
            'pointermove',
            handlePointerMove,
        )

        window.addEventListener(
            'pointerup',
            finishDrag,
        )

        window.addEventListener(
            'pointercancel',
            finishDrag,
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

                ...(!maximized && size
                    ? {
                        width: `${size.width}px`,
                        height: `${size.height}px`,
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

            <div
                className="resize-handle resize-right"
                onPointerDown={(event) =>
                    handleResizeStart(event, 'right')
                }
            />

            <div
                className="resize-handle resize-bottom"
                onPointerDown={(event) =>
                    handleResizeStart(event, 'bottom')
                }
            />

            <div
                className="resize-handle resize-corner"
                onPointerDown={(event) =>
                    handleResizeStart(event, 'right-bottom')
                }
            />
        </div>
    )
}

export default Window