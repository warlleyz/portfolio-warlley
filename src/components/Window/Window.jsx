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

const DESKTOP_PADDING = 12
const TASKBAR_SPACE = 88


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
    const windowRef =
        useRef(null)

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


    /* === DIMENSÕES === */

    /* ----- TAMANHO ----- */
    const currentSize = {
        width:
            size?.width ??
            Math.min(
                DEFAULT_WIDTH,
                window.innerWidth - 80,
            ),

        height:
            size?.height ??
            Math.min(
                DEFAULT_HEIGHT,
                window.innerHeight -
                TASKBAR_SPACE -
                40,
            ),
    }


    /* ----- POSIÇÃO ----- */
    const defaultPosition = {
        x:
            Math.max(
                (
                    window.innerWidth -
                    currentSize.width
                ) / 2,
                DESKTOP_PADDING,
            ),

        y:
            Math.max(
                (
                    window.innerHeight -
                    TASKBAR_SPACE -
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
                window.innerWidth -
                width -
                DESKTOP_PADDING,
                DESKTOP_PADDING,
            )

        const maxY =
            Math.max(
                window.innerHeight -
                TASKBAR_SPACE -
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
        const maxWidth =
            Math.max(
                MIN_WIDTH,
                window.innerWidth -
                x -
                DESKTOP_PADDING,
            )

        const maxHeight =
            Math.max(
                MIN_HEIGHT,
                window.innerHeight -
                TASKBAR_SPACE -
                y -
                DESKTOP_PADDING,
            )

        return {
            width:
                Math.min(
                    Math.max(
                        width,
                        MIN_WIDTH,
                    ),
                    maxWidth,
                ),

            height:
                Math.min(
                    Math.max(
                        height,
                        MIN_HEIGHT,
                    ),
                    maxHeight,
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
        const handlePointerMove = (
            event,
        ) => {
            /* ----- DRAG ----- */
            if (
                dragging &&
                dragState.current
            ) {
                const deltaX =
                    event.clientX -
                    dragState.current
                        .mouseX

                const deltaY =
                    event.clientY -
                    dragState.current
                        .mouseY

                const nextPosition =
                    constrainPosition(
                        dragState.current
                            .startX +
                        deltaX,

                        dragState.current
                            .startY +
                        deltaY,
                    )

                onPositionChange?.(
                    nextPosition,
                )

                return
            }


            /* ----- RESIZE ----- */
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
                        nextX =
                            state.startX +
                            (
                                state.startWidth -
                                MIN_WIDTH
                            )

                        nextWidth =
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
                        nextY =
                            state.startY +
                            (
                                state.startHeight -
                                MIN_HEIGHT
                            )

                        nextHeight =
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


        const handlePointerUp =
            () => {
                dragState.current =
                    null

                resizeState.current =
                    null

                setDragging(false)
                setResizing(false)
            }


        window.addEventListener(
            'mousemove',
            handlePointerMove,
        )

        window.addEventListener(
            'mouseup',
            handlePointerUp,
        )


        return () => {
            window.removeEventListener(
                'mousemove',
                handlePointerMove,
            )

            window.removeEventListener(
                'mouseup',
                handlePointerUp,
            )
        }
    }, [
        dragging,
        resizing,
        maximized,
        currentPosition.x,
        currentPosition.y,
        currentSize.width,
        currentSize.height,
        onPositionChange,
        onSizeChange,
    ])


    /* === AJUSTE DE VIEWPORT === */
    useEffect(() => {
        const handleResize =
            () => {
                if (maximized) {
                    return
                }

                const nextSize =
                    constrainSize(
                        currentSize.width,
                        currentSize.height,
                    )

                const nextPosition =
                    constrainPosition(
                        currentPosition.x,
                        currentPosition.y,
                        nextSize.width,
                        nextSize.height,
                    )

                onSizeChange?.(
                    nextSize,
                )

                onPositionChange?.(
                    nextPosition,
                )
            }

        window.addEventListener(
            'resize',
            handleResize,
        )

        return () => {
            window.removeEventListener(
                'resize',
                handleResize,
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
    const style =
        maximized
            ? {
                zIndex,
            }
            : {
                zIndex,

                left:
                    currentPosition.x,

                top:
                    currentPosition.y,

                width:
                    currentSize.width,

                height:
                    currentSize.height,
            }


    /* === RENDERIZAÇÃO === */
    if (
        hidden &&
        !minimizing
    ) {
        return null
    }


    return (
        <section
            ref={windowRef}
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
                    <span className="window-title-dot" />

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