import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from 'react'

import {
    createPortal,
} from 'react-dom'

import './Tooltip.css'


/* === CONFIGURAÇÃO === */
const TOOLTIP_GAP =
    8

const VIEWPORT_PADDING =
    8


function Tooltip({
    children,
    text,
    position = 'top',
}) {
    /* === REFERÊNCIAS === */
    const targetRef =
        useRef(null)

    const tooltipRef =
        useRef(null)

    const previousDescribedByRef =
        useRef(null)


    /* === IDENTIFICADOR === */
    const tooltipId =
        useId()


    /* === ESTADO === */
    const [
        visible,
        setVisible,
    ] = useState(false)

    const [
        coordinates,
        setCoordinates,
    ] = useState({
        top:
            0,

        left:
            0,
    })

    const [
        currentPosition,
        setCurrentPosition,
    ] = useState(
        position,
    )


    /* === DISPONIBILIDADE === */
    const hasTooltip =
        Boolean(
            text,
        )


    /* === POSICIONAMENTO === */
    const updatePosition =
        useCallback(
            () => {
                const target =
                    targetRef.current

                const tooltip =
                    tooltipRef.current

                if (
                    !target ||
                    !tooltip
                ) {
                    return
                }

                const targetRect =
                    target.getBoundingClientRect()

                const tooltipRect =
                    tooltip.getBoundingClientRect()

                let nextPosition =
                    position

                let top =
                    0

                let left =
                    0


                /* ----- VERIFICAR ESPAÇO ----- */
                if (
                    position === 'top' &&
                    targetRect.top -
                    tooltipRect.height -
                    TOOLTIP_GAP <
                    VIEWPORT_PADDING
                ) {
                    nextPosition =
                        'bottom'
                } else if (
                    position === 'bottom' &&
                    targetRect.bottom +
                    tooltipRect.height +
                    TOOLTIP_GAP >
                    window.innerHeight -
                    VIEWPORT_PADDING
                ) {
                    nextPosition =
                        'top'
                } else if (
                    position === 'left' &&
                    targetRect.left -
                    tooltipRect.width -
                    TOOLTIP_GAP <
                    VIEWPORT_PADDING
                ) {
                    nextPosition =
                        'right'
                } else if (
                    position === 'right' &&
                    targetRect.right +
                    tooltipRect.width +
                    TOOLTIP_GAP >
                    window.innerWidth -
                    VIEWPORT_PADDING
                ) {
                    nextPosition =
                        'left'
                }


                /* ----- SUPERIOR ----- */
                if (
                    nextPosition ===
                    'top'
                ) {
                    top =
                        targetRect.top -
                        tooltipRect.height -
                        TOOLTIP_GAP

                    left =
                        targetRect.left +
                        targetRect.width / 2 -
                        tooltipRect.width / 2
                }


                /* ----- INFERIOR ----- */
                if (
                    nextPosition ===
                    'bottom'
                ) {
                    top =
                        targetRect.bottom +
                        TOOLTIP_GAP

                    left =
                        targetRect.left +
                        targetRect.width / 2 -
                        tooltipRect.width / 2
                }


                /* ----- ESQUERDA ----- */
                if (
                    nextPosition ===
                    'left'
                ) {
                    top =
                        targetRect.top +
                        targetRect.height / 2 -
                        tooltipRect.height / 2

                    left =
                        targetRect.left -
                        tooltipRect.width -
                        TOOLTIP_GAP
                }


                /* ----- DIREITA ----- */
                if (
                    nextPosition ===
                    'right'
                ) {
                    top =
                        targetRect.top +
                        targetRect.height / 2 -
                        tooltipRect.height / 2

                    left =
                        targetRect.right +
                        TOOLTIP_GAP
                }


                /* ----- LIMITES HORIZONTAIS ----- */
                left =
                    Math.min(
                        Math.max(
                            left,
                            VIEWPORT_PADDING,
                        ),
                        Math.max(
                            window.innerWidth -
                            tooltipRect.width -
                            VIEWPORT_PADDING,
                            VIEWPORT_PADDING,
                        ),
                    )


                /* ----- LIMITES VERTICAIS ----- */
                top =
                    Math.min(
                        Math.max(
                            top,
                            VIEWPORT_PADDING,
                        ),
                        Math.max(
                            window.innerHeight -
                            tooltipRect.height -
                            VIEWPORT_PADDING,
                            VIEWPORT_PADDING,
                        ),
                    )

                setCoordinates({
                    top,
                    left,
                })

                setCurrentPosition(
                    nextPosition,
                )
            },
            [
                position,
            ],
        )


    /* === ELEMENTO ALVO === */
    const getTargetElement = (
        event,
    ) => {
        const wrapper =
            event.currentTarget

        return (
            wrapper.firstElementChild ??
            null
        )
    }


    /* === ACESSIBILIDADE === */
    const addDescription = (
        target,
    ) => {
        if (
            !target
        ) {
            return
        }

        const previousDescribedBy =
            target.getAttribute(
                'aria-describedby',
            )

        previousDescribedByRef.current =
            previousDescribedBy

        const nextDescribedBy =
            previousDescribedBy
                ? `${previousDescribedBy} ${tooltipId}`
                : tooltipId

        target.setAttribute(
            'aria-describedby',
            nextDescribedBy,
        )
    }


    /* ----- RESTAURAR ----- */
    const restoreDescription =
        () => {
            const target =
                targetRef.current

            if (
                !target
            ) {
                return
            }

            const previousDescribedBy =
                previousDescribedByRef.current

            if (
                previousDescribedBy
            ) {
                target.setAttribute(
                    'aria-describedby',
                    previousDescribedBy,
                )
            } else {
                target.removeAttribute(
                    'aria-describedby',
                )
            }

            previousDescribedByRef.current =
                null
        }


    /* === EXIBIR === */
    const showTooltip = (
        event,
    ) => {
        if (
            !hasTooltip
        ) {
            return
        }

        const target =
            getTargetElement(
                event,
            )

        if (
            !target
        ) {
            return
        }

        if (
            targetRef.current !==
            target
        ) {
            restoreDescription()

            targetRef.current =
                target

            addDescription(
                target,
            )
        }

        setVisible(
            true,
        )
    }


    /* === OCULTAR === */
    const hideTooltip =
        () => {
            restoreDescription()

            targetRef.current =
                null

            setVisible(
                false,
            )
        }


    /* === POSICIONAMENTO ATIVO === */
    useEffect(() => {
        if (
            !visible
        ) {
            return
        }

        const frame =
            requestAnimationFrame(
                updatePosition,
            )

        window.addEventListener(
            'resize',
            updatePosition,
        )

        window.addEventListener(
            'scroll',
            updatePosition,
            true,
        )

        return () => {
            cancelAnimationFrame(
                frame,
            )

            window.removeEventListener(
                'resize',
                updatePosition,
            )

            window.removeEventListener(
                'scroll',
                updatePosition,
                true,
            )
        }
    }, [
        visible,
        text,
        updatePosition,
    ])


    /* === LIMPEZA === */
    useEffect(
        () =>
            () => {
                restoreDescription()

                targetRef.current =
                    null
            },
        [],
    )


    /* === SEM TOOLTIP === */
    if (
        !hasTooltip
    ) {
        return children
    }


    /* === RENDERIZAÇÃO === */
    return (
        <>
            <span
                className="ws-tooltip-anchor"
                onMouseEnter={
                    showTooltip
                }
                onMouseLeave={
                    hideTooltip
                }
                onFocus={
                    showTooltip
                }
                onBlur={
                    hideTooltip
                }
            >
                {children}
            </span>

            {visible &&
                typeof document !==
                'undefined' &&
                createPortal(
                    <div
                        ref={
                            tooltipRef
                        }
                        id={
                            tooltipId
                        }
                        className="ws-tooltip"
                        data-position={
                            currentPosition
                        }
                        role="tooltip"
                        style={{
                            top:
                                coordinates.top,

                            left:
                                coordinates.left,
                        }}
                    >
                        {text}
                    </div>,
                    document.body,
                )}
        </>
    )
}


export default Tooltip