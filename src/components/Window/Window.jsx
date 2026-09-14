import {
    useEffect,
    useRef,
} from 'react'

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

    useEffect(() => {
        if (!maximized) {
            return
        }

        const windowElement = windowRef.current

        if (!windowElement) {
            return
        }

        windowElement.style.left = ''
        windowElement.style.top = ''
        windowElement.style.width = ''
        windowElement.style.height = ''
        windowElement.style.translate = ''
        windowElement.style.transition = ''
        windowElement.style.animation = ''
    }, [maximized])

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

        const rect =
            windowElement.getBoundingClientRect()

        const startX = event.clientX
        const startY = event.clientY

        const startLeft = rect.left
        const startTop = rect.top
        const startRight = rect.right
        const startBottom = rect.bottom

        const startWidth = rect.width
        const startHeight = rect.height

        const minWidth = 420
        const minHeight = 280

        let currentX = startLeft
        let currentY = startTop
        let currentWidth = startWidth
        let currentHeight = startHeight

        let animationFrame = null

        windowElement.classList.add(
            'window-resizing',
        )

        const handlePointerMove = (moveEvent) => {
            const deltaX =
                moveEvent.clientX - startX

            const deltaY =
                moveEvent.clientY - startY

            if (direction.includes('right')) {
                currentWidth = Math.min(
                    Math.max(
                        startWidth + deltaX,
                        minWidth,
                    ),
                    window.innerWidth - startLeft,
                )
            }

            if (direction.includes('left')) {
                currentWidth = Math.min(
                    Math.max(
                        startWidth - deltaX,
                        minWidth,
                    ),
                    startRight,
                )

                currentX =
                    startRight - currentWidth
            }

            if (direction.includes('bottom')) {
                currentHeight = Math.min(
                    Math.max(
                        startHeight + deltaY,
                        minHeight,
                    ),
                    window.innerHeight - startTop,
                )
            }

            if (direction.includes('top')) {
                currentHeight = Math.min(
                    Math.max(
                        startHeight - deltaY,
                        minHeight,
                    ),
                    startBottom,
                )

                currentY =
                    startBottom - currentHeight
            }

            if (animationFrame) {
                cancelAnimationFrame(
                    animationFrame,
                )
            }

            animationFrame =
                requestAnimationFrame(() => {
                    windowElement.style.left =
                        '0px'

                    windowElement.style.top =
                        '0px'

                    windowElement.style.translate =
                        `${currentX}px ${currentY}px`

                    windowElement.style.width =
                        `${currentWidth}px`

                    windowElement.style.height =
                        `${currentHeight}px`
                })
        }

        const finishResize = () => {
            if (animationFrame) {
                cancelAnimationFrame(
                    animationFrame,
                )
            }

            windowElement.classList.remove(
                'window-resizing',
            )

            onSizeChange?.({
                width: currentWidth,
                height: currentHeight,
            })

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
        if (event.button !== 0) {
            return
        }

        const windowElement =
            windowRef.current

        if (!windowElement) {
            return
        }

        event.preventDefault()
        onFocus?.()

        const startPointerX =
            event.clientX

        const startPointerY =
            event.clientY

        const initialRect =
            windowElement.getBoundingClientRect()

        const pointerRatioX =
            Math.min(
                Math.max(
                    (
                        startPointerX -
                        initialRect.left
                    ) /
                    initialRect.width,
                    0,
                ),
                1,
            )

        let currentX =
            initialRect.left

        let currentY =
            initialRect.top

        let currentWidth =
            initialRect.width

        let currentHeight =
            initialRect.height

        let offsetX =
            startPointerX -
            initialRect.left

        let offsetY =
            Math.min(
                startPointerY -
                initialRect.top,
                40,
            )

        let dragging = false

        let restoredFromMaximized =
            false

        const handlePointerMove = (
            moveEvent,
        ) => {
            const movedX =
                Math.abs(
                    moveEvent.clientX -
                    startPointerX,
                )

            const movedY =
                Math.abs(
                    moveEvent.clientY -
                    startPointerY,
                )

            if (
                !dragging &&
                movedX < 3 &&
                movedY < 3
            ) {
                return
            }

            if (!dragging) {
                dragging = true

                if (maximized) {
                    restoredFromMaximized =
                        true

                    const restoredWidth =
                        size?.width ?? 720

                    const restoredHeight =
                        size?.height ?? 480

                    currentWidth =
                        Math.min(
                            restoredWidth,
                            window.innerWidth,
                        )

                    currentHeight =
                        Math.min(
                            restoredHeight,
                            window.innerHeight,
                        )

                    onMaximize?.()

                    requestAnimationFrame(() => {
                        const restoredElement =
                            windowRef.current

                        if (!restoredElement) {
                            return
                        }

                        restoredElement.style.transition =
                            'none'

                        restoredElement.style.animation =
                            'none'

                        restoredElement.style.width =
                            `${currentWidth}px`

                        restoredElement.style.height =
                            `${currentHeight}px`

                        currentX =
                            Math.min(
                                Math.max(
                                    moveEvent.clientX -
                                    currentWidth *
                                    pointerRatioX,
                                    0,
                                ),
                                Math.max(
                                    window.innerWidth -
                                    currentWidth,
                                    0,
                                ),
                            )

                        currentY =
                            Math.max(
                                moveEvent.clientY - 20,
                                0,
                            )

                        restoredElement.style.left =
                            '0px'

                        restoredElement.style.top =
                            '0px'

                        restoredElement.style.translate =
                            `${currentX}px ${currentY}px`

                        offsetX =
                            moveEvent.clientX -
                            currentX

                        offsetY =
                            moveEvent.clientY -
                            currentY

                        restoredElement.classList.add(
                            'window-dragging',
                        )
                    })

                    return
                }

                windowElement.classList.add(
                    'window-dragging',
                )
            }

            const activeWindow =
                windowRef.current

            if (!activeWindow) {
                return
            }

            const maxX = Math.max(
                window.innerWidth -
                currentWidth,
                0,
            )

            const maxY = Math.max(
                window.innerHeight -
                currentHeight,
                0,
            )

            currentX = Math.min(
                Math.max(
                    moveEvent.clientX -
                    offsetX,
                    0,
                ),
                maxX,
            )

            currentY = Math.min(
                Math.max(
                    moveEvent.clientY -
                    offsetY,
                    0,
                ),
                maxY,
            )

            activeWindow.style.left =
                '0px'

            activeWindow.style.top =
                '0px'

            activeWindow.style.translate =
                `${currentX}px ${currentY}px`
        }

        const finishDrag = () => {
            const activeWindow =
                windowRef.current

            if (activeWindow) {
                activeWindow.classList.remove(
                    'window-dragging',
                )

                if (
                    restoredFromMaximized
                ) {
                    activeWindow.style.transition =
                        ''

                    activeWindow.style.animation =
                        ''
                }
            }

            if (dragging) {
                onPositionChange?.({
                    x: currentX,
                    y: currentY,
                })
            }

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

    const handleHeaderDoubleClick = (
        event,
    ) => {
        event.preventDefault()

        onFocus?.()
        onMaximize?.()
    }

    return (
        <div
            ref={windowRef}
            className={`window
                ${maximized
                    ? 'window-maximized'
                    : ''
                }
                ${minimizing
                    ? 'window-minimizing'
                    : ''
                }
                ${closing
                    ? 'window-closing'
                    : ''
                }
            `}
            style={{
                zIndex,

                ...(
                    !maximized &&
                        position
                        ? {
                            left: '0px',
                            top: '0px',
                            translate:
                                `${position.x}px ${position.y}px`,
                        }
                        : {}
                ),

                ...(
                    !maximized &&
                        size
                        ? {
                            width:
                                `${size.width}px`,
                            height:
                                `${size.height}px`,
                        }
                        : {}
                ),
            }}
            onMouseDown={onFocus}
        >
            <div
                className="window-header"
                onPointerDown={
                    handleDragStart
                }
                onDoubleClick={
                    handleHeaderDoubleClick
                }
            >
                <span className="window-title">
                    {title}
                </span>

                <div
                    className="window-controls"
                    onPointerDown={(event) =>
                        event.stopPropagation()
                    }
                    onDoubleClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <button
                        type="button"
                        onClick={onMinimize}
                        aria-label="Minimizar"
                    >
                        <Minus
                            size={18}
                            strokeWidth={1.8}
                        />
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
                        <Square
                            size={16}
                            strokeWidth={1.8}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X
                            size={18}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            </div>

            <div className="window-content">
                {children}
            </div>

            <div
                className="resize-handle resize-top"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'top',
                    )
                }
            />

            <div
                className="resize-handle resize-bottom"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'bottom',
                    )
                }
            />

            <div
                className="resize-handle resize-left"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'left',
                    )
                }
            />

            <div
                className="resize-handle resize-right"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'right',
                    )
                }
            />

            <div
                className="resize-handle resize-top-left"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'top-left',
                    )
                }
            />

            <div
                className="resize-handle resize-top-right"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'top-right',
                    )
                }
            />

            <div
                className="resize-handle resize-bottom-left"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'bottom-left',
                    )
                }
            />

            <div
                className="resize-handle resize-bottom-right"
                onPointerDown={(event) =>
                    handleResizeStart(
                        event,
                        'bottom-right',
                    )
                }
            />
        </div>
    )
}

export default Window