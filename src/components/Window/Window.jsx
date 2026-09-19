import {
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    Maximize2,
    Minimize2,
    Minus,
    X,
} from 'lucide-react'

import './Window.css'


/* === CONFIGURAÇÃO === */
const DEFAULT_WIDTH = 720
const DEFAULT_HEIGHT = 500

const MIN_WIDTH = 360
const MIN_HEIGHT = 260

const DESKTOP_PADDING = 8

const MAXIMIZED_TOP = 8
const MAXIMIZED_SIDE = 8
const MAXIMIZED_BOTTOM = 8


function Window({
    title,
    children,

    active = false,
    hidden = false,
    maximized = false,
    minimizing = false,
    closing = false,

    position = null,
    size = null,
    zIndex = 10,

    onFocus,
    onClose,
    onMinimize,
    onMaximize,
    onPositionChange,
    onSizeChange,
}) {
    const dragState =
        useRef(null)

    const resizeState =
        useRef(null)

    const [
        dragging,
        setDragging,
    ] = useState(false)

    const [
        resizing,
        setResizing,
    ] = useState(false)

    const [
        viewport,
        setViewport,
    ] = useState({
        width:
            window.innerWidth,

        height:
            window.innerHeight,
    })


    /* === DIMENSÕES === */

    /* ----- TAMANHO ----- */
    const currentSize = {
        width:
            size?.width ??
            Math.min(
                DEFAULT_WIDTH,
                viewport.width -
                DESKTOP_PADDING * 2,
            ),

        height:
            size?.height ??
            Math.min(
                DEFAULT_HEIGHT,
                viewport.height -
                DESKTOP_PADDING * 2,
            ),
    }


    /* ----- POSIÇÃO ----- */
    const defaultPosition = {
        x:
            Math.max(
                (
                    viewport.width -
                    currentSize.width
                ) / 2,
                DESKTOP_PADDING,
            ),

        y:
            Math.max(
                (
                    viewport.height -
                    currentSize.height
                ) / 2,
                DESKTOP_PADDING,
            ),
    }

    const currentPosition =
        position ??
        defaultPosition


    /* === LIMITES === */

    /* ----- POSIÇÃO ----- */
    const constrainPosition = (
        x,
        y,
        width =
            currentSize.width,
        height =
            currentSize.height,
    ) => {
        const maxX =
            Math.max(
                viewport.width -
                width -
                DESKTOP_PADDING,
                DESKTOP_PADDING,
            )

        const maxY =
            Math.max(
                viewport.height -
                height -
                DESKTOP_PADDING,
                DESKTOP_PADDING,
            )

        return {
            x:
                Math.min(
                    Math.max(
                        x,
                        DESKTOP_PADDING,
                    ),
                    maxX,
                ),

            y:
                Math.min(
                    Math.max(
                        y,
                        DESKTOP_PADDING,
                    ),
                    maxY,
                ),
        }
    }


    /* ----- TAMANHO ----- */
    const constrainSize = (
        width,
        height,
        x =
            currentPosition.x,
        y =
            currentPosition.y,
    ) => {
        const availableWidth =
            viewport.width -
            x -
            DESKTOP_PADDING

        const availableHeight =
            viewport.height -
            y -
            DESKTOP_PADDING

        return {
            width:
                Math.min(
                    Math.max(
                        width,
                        MIN_WIDTH,
                    ),
                    Math.max(
                        availableWidth,
                        MIN_WIDTH,
                    ),
                ),

            height:
                Math.min(
                    Math.max(
                        height,
                        MIN_HEIGHT,
                    ),
                    Math.max(
                        availableHeight,
                        MIN_HEIGHT,
                    ),
                ),
        }
    }


    /* === FOCO === */
    const handleFocus = () => {
        onFocus?.()
    }


    /* === ARRASTAR === */

    /* ----- INICIAR ----- */
    const handleDragStart = (
        event,
    ) => {
        if (
            maximized ||
            event.button !== 0
        ) {
            return
        }

        if (
            event.target.closest(
                '.window-controls',
            )
        ) {
            return
        }

        event.preventDefault()

        handleFocus()

        dragState.current = {
            mouseX:
                event.clientX,

            mouseY:
                event.clientY,

            startX:
                currentPosition.x,

            startY:
                currentPosition.y,
        }

        setDragging(true)
    }


    /* === REDIMENSIONAR === */

    /* ----- INICIAR ----- */
    const handleResizeStart = (
        event,
        direction,
    ) => {
        if (
            maximized ||
            event.button !== 0
        ) {
            return
        }

        event.preventDefault()
        event.stopPropagation()

        handleFocus()

        resizeState.current = {
            direction,

            mouseX:
                event.clientX,

            mouseY:
                event.clientY,

            startX:
                currentPosition.x,

            startY:
                currentPosition.y,

            startWidth:
                currentSize.width,

            startHeight:
                currentSize.height,
        }

        setResizing(true)
    }


    /* === MOVIMENTO GLOBAL === */
    useEffect(() => {
        const handleMouseMove = (
            event,
        ) => {
            /* ----- ARRASTAR ----- */
            if (
                dragging &&
                dragState.current
            ) {
                const state =
                    dragState.current

                const deltaX =
                    event.clientX -
                    state.mouseX

                const deltaY =
                    event.clientY -
                    state.mouseY

                const nextPosition =
                    constrainPosition(
                        state.startX +
                        deltaX,

                        state.startY +
                        deltaY,
                    )

                onPositionChange?.(
                    nextPosition,
                )

                return
            }


            /* ----- REDIMENSIONAR ----- */
            if (
                resizing &&
                resizeState.current
            ) {
                const state =
                    resizeState.current

                const deltaX =
                    event.clientX -
                    state.mouseX

                const deltaY =
                    event.clientY -
                    state.mouseY

                let nextX =
                    state.startX

                let nextY =
                    state.startY

                let nextWidth =
                    state.startWidth

                let nextHeight =
                    state.startHeight


                /* ----- DIREITA ----- */
                if (
                    state.direction.includes(
                        'right',
                    )
                ) {
                    nextWidth =
                        state.startWidth +
                        deltaX
                }


                /* ----- ESQUERDA ----- */
                if (
                    state.direction.includes(
                        'left',
                    )
                ) {
                    nextWidth =
                        state.startWidth -
                        deltaX

                    nextX =
                        state.startX +
                        deltaX

                    if (
                        nextWidth <
                        MIN_WIDTH
                    ) {
                        nextWidth =
                            MIN_WIDTH

                        nextX =
                            state.startX +
                            state.startWidth -
                            MIN_WIDTH
                    }

                    if (
                        nextX <
                        DESKTOP_PADDING
                    ) {
                        nextWidth +=
                            nextX -
                            DESKTOP_PADDING

                        nextX =
                            DESKTOP_PADDING
                    }
                }


                /* ----- INFERIOR ----- */
                if (
                    state.direction.includes(
                        'bottom',
                    )
                ) {
                    nextHeight =
                        state.startHeight +
                        deltaY
                }


                /* ----- SUPERIOR ----- */
                if (
                    state.direction.includes(
                        'top',
                    )
                ) {
                    nextHeight =
                        state.startHeight -
                        deltaY

                    nextY =
                        state.startY +
                        deltaY

                    if (
                        nextHeight <
                        MIN_HEIGHT
                    ) {
                        nextHeight =
                            MIN_HEIGHT

                        nextY =
                            state.startY +
                            state.startHeight -
                            MIN_HEIGHT
                    }

                    if (
                        nextY <
                        DESKTOP_PADDING
                    ) {
                        nextHeight +=
                            nextY -
                            DESKTOP_PADDING

                        nextY =
                            DESKTOP_PADDING
                    }
                }


                const nextSize =
                    constrainSize(
                        nextWidth,
                        nextHeight,
                        nextX,
                        nextY,
                    )

                const nextPosition =
                    constrainPosition(
                        nextX,
                        nextY,
                        nextSize.width,
                        nextSize.height,
                    )

                onPositionChange?.(
                    nextPosition,
                )

                onSizeChange?.(
                    nextSize,
                )
            }
        }


        const handleMouseUp = () => {
            dragState.current =
                null

            resizeState.current =
                null

            setDragging(false)
            setResizing(false)
        }


        window.addEventListener(
            'mousemove',
            handleMouseMove,
        )

        window.addEventListener(
            'mouseup',
            handleMouseUp,
        )


        return () => {
            window.removeEventListener(
                'mousemove',
                handleMouseMove,
            )

            window.removeEventListener(
                'mouseup',
                handleMouseUp,
            )
        }
    })


    /* === VIEWPORT === */
    useEffect(() => {
        const handleViewportResize =
            () => {
                const nextViewport = {
                    width:
                        window.innerWidth,

                    height:
                        window.innerHeight,
                }

                setViewport(
                    nextViewport,
                )

                if (maximized) {
                    return
                }

                const nextWidth =
                    Math.min(
                        currentSize.width,
                        nextViewport.width -
                        DESKTOP_PADDING * 2,
                    )

                const nextHeight =
                    Math.min(
                        currentSize.height,
                        nextViewport.height -
                        DESKTOP_PADDING * 2,
                    )

                const nextSize = {
                    width:
                        Math.max(
                            nextWidth,
                            Math.min(
                                MIN_WIDTH,
                                nextViewport.width -
                                DESKTOP_PADDING * 2,
                            ),
                        ),

                    height:
                        Math.max(
                            nextHeight,
                            Math.min(
                                MIN_HEIGHT,
                                nextViewport.height -
                                DESKTOP_PADDING * 2,
                            ),
                        ),
                }

                const maxX =
                    Math.max(
                        nextViewport.width -
                        nextSize.width -
                        DESKTOP_PADDING,
                        DESKTOP_PADDING,
                    )

                const maxY =
                    Math.max(
                        nextViewport.height -
                        nextSize.height -
                        DESKTOP_PADDING,
                        DESKTOP_PADDING,
                    )

                const nextPosition = {
                    x:
                        Math.min(
                            Math.max(
                                currentPosition.x,
                                DESKTOP_PADDING,
                            ),
                            maxX,
                        ),

                    y:
                        Math.min(
                            Math.max(
                                currentPosition.y,
                                DESKTOP_PADDING,
                            ),
                            maxY,
                        ),
                }

                onSizeChange?.(
                    nextSize,
                )

                onPositionChange?.(
                    nextPosition,
                )
            }


        window.addEventListener(
            'resize',
            handleViewportResize,
        )


        return () => {
            window.removeEventListener(
                'resize',
                handleViewportResize,
            )
        }
    })


    /* === CLASSES === */
    const className = [
        'window',

        active
            ? 'window-active'
            : 'window-inactive',

        maximized
            ? 'window-maximized'
            : '',

        dragging
            ? 'window-dragging'
            : '',

        resizing
            ? 'window-resizing'
            : '',

        minimizing
            ? 'window-minimizing'
            : '',

        closing
            ? 'window-closing'
            : '',
    ]
        .filter(Boolean)
        .join(' ')


    /* === ESTILO === */

    /* ----- MAXIMIZADA ----- */
    const maximizedStyle = {
        left:
            MAXIMIZED_SIDE,

        top:
            MAXIMIZED_TOP,

        width:
            Math.max(
                viewport.width -
                MAXIMIZED_SIDE * 2,
                0,
            ),

        height:
            Math.max(
                viewport.height -
                MAXIMIZED_TOP -
                MAXIMIZED_BOTTOM,
                0,
            ),

        zIndex:
            zIndex + 100,
    }


    /* ----- NORMAL ----- */
    const normalStyle = {
        left:
            currentPosition.x,

        top:
            currentPosition.y,

        width:
            currentSize.width,

        height:
            currentSize.height,

        zIndex:
            zIndex + 100,
    }


    const style =
        maximized
            ? maximizedStyle
            : normalStyle


    /* === RENDERIZAÇÃO === */
    if (
        hidden &&
        !minimizing
    ) {
        return null
    }


    return (
        <section
            className={
                className
            }
            style={
                style
            }
            onMouseDown={
                handleFocus
            }
            role="dialog"
            aria-label={
                title
            }
        >
            <header
                className="window-header"
                onMouseDown={
                    handleDragStart
                }
                onDoubleClick={
                    onMaximize
                }
            >
                <div className="window-title">
                    <span
                        className="window-title-dot"
                    />

                    <span className="window-title-text">
                        {title}
                    </span>
                </div>

                <div
                    className="window-controls"
                    aria-label="Controles da janela"
                >
                    <button
                        className="window-control window-control-minimize"
                        type="button"
                        onClick={
                            onMinimize
                        }
                        aria-label={
                            `Minimizar ${title}`
                        }
                        title="Minimizar"
                    >
                        <Minus
                            size={16}
                            strokeWidth={1.8}
                        />
                    </button>

                    <button
                        className="window-control window-control-maximize"
                        type="button"
                        onClick={
                            onMaximize
                        }
                        aria-label={
                            maximized
                                ? `Restaurar ${title}`
                                : `Maximizar ${title}`
                        }
                        title={
                            maximized
                                ? 'Restaurar'
                                : 'Maximizar'
                        }
                    >
                        {
                            maximized
                                ? (
                                    <Minimize2
                                        size={14}
                                        strokeWidth={1.8}
                                    />
                                )
                                : (
                                    <Maximize2
                                        size={14}
                                        strokeWidth={1.8}
                                    />
                                )
                        }
                    </button>

                    <button
                        className="window-control window-control-close"
                        type="button"
                        onClick={
                            onClose
                        }
                        aria-label={
                            `Fechar ${title}`
                        }
                        title="Fechar"
                    >
                        <X
                            size={17}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            </header>

            <div className="window-content">
                {children}
            </div>

            {!maximized && (
                <>
                    <div
                        className="window-resize window-resize-top"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'top',
                            )
                        }
                    />

                    <div
                        className="window-resize window-resize-right"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'right',
                            )
                        }
                    />

                    <div
                        className="window-resize window-resize-bottom"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'bottom',
                            )
                        }
                    />

                    <div
                        className="window-resize window-resize-left"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'left',
                            )
                        }
                    />

                    <div
                        className="window-resize window-resize-top-left"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'top-left',
                            )
                        }
                    />

                    <div
                        className="window-resize window-resize-top-right"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'top-right',
                            )
                        }
                    />

                    <div
                        className="window-resize window-resize-bottom-left"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'bottom-left',
                            )
                        }
                    />

                    <div
                        className="window-resize window-resize-bottom-right"
                        onMouseDown={(
                            event,
                        ) =>
                            handleResizeStart(
                                event,
                                'bottom-right',
                            )
                        }
                    />
                </>
            )}
        </section>
    )
}

export default Window