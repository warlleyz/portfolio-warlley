import {
    useEffect,
    useRef,
} from 'react'

import {
    Moon,
    Sun,
} from 'lucide-react'

import './QuickControls.css'


function QuickControls({
    theme,
    toggleTheme,
    brightness,
    setBrightness,
    glassOpacity,
    setGlassOpacity,
    onClose,
}) {
    const panelRef =
        useRef(null)

    /* === PREENCHIMENTO DOS SLIDERS === */
    const getRangeProgress = (
        value,
        min,
        max,
    ) => {
        return (
            (
                value -
                min
            ) /
            (
                max -
                min
            )
        ) * 100
    }


    const brightnessProgress =
        getRangeProgress(
            brightness,
            75,
            105,
        )


    const glassProgress =
        getRangeProgress(
            glassOpacity,
            35,
            95,
        )


    /* === FECHAR COM ESC === */
    useEffect(() => {
        const handleKeyDown = (
            event,
        ) => {
            if (
                event.key === 'Escape'
            ) {
                onClose()
            }
        }

        window.addEventListener(
            'keydown',
            handleKeyDown,
        )

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        }
    }, [onClose])


    /* === FECHAR AO CLICAR FORA === */
    useEffect(() => {
        const handleMouseDown = (
            event,
        ) => {
            if (
                event.target.closest(
                    '.taskbar-quick-controls-button',
                )
            ) {
                return
            }

            if (
                panelRef.current &&
                !panelRef.current.contains(
                    event.target,
                )
            ) {
                onClose()
            }
        }

        document.addEventListener(
            'mousedown',
            handleMouseDown,
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handleMouseDown,
            )
        }
    }, [onClose])


    return (
        <aside
            ref={panelRef}
            className="quick-controls"
            aria-label="Controles rápidos"
        >
            <header className="quick-controls-header">
                <div>
                    <span className="quick-controls-label">
                        WS OS
                    </span>

                    <h2 className="quick-controls-title">
                        Controles rápidos
                    </h2>
                </div>
            </header>


            <div className="quick-controls-content">
                <button
                    className={[
                        'quick-control-theme',
                        theme === 'dark'
                            ? 'quick-control-theme-dark'
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    type="button"
                    onClick={
                        toggleTheme
                    }
                >
                    <span className="quick-control-theme-icon">
                        {
                            theme === 'dark'
                                ? (
                                    <Moon
                                        size={19}
                                        strokeWidth={1.8}
                                    />
                                )
                                : (
                                    <Sun
                                        size={19}
                                        strokeWidth={1.8}
                                    />
                                )
                        }
                    </span>

                    <span className="quick-control-theme-text">
                        <strong>
                            Tema
                        </strong>

                        <span>
                            {
                                theme === 'dark'
                                    ? 'Escuro'
                                    : 'Claro'
                            }
                        </span>
                    </span>
                </button>


                <div className="quick-control-group">
                    <div className="quick-control-heading">
                        <div>
                            <strong>
                                Brilho
                            </strong>

                            <span>
                                Intensidade visual
                            </span>
                        </div>

                        <span className="quick-control-value">
                            {brightness}%
                        </span>
                    </div>

                    <input
                        className="quick-control-range"
                        type="range"
                        min="75"
                        max="105"
                        style={{
                            '--range-progress':
                                `${brightnessProgress}%`,
                        }}
                        value={
                            brightness
                        }
                        onChange={(
                            event,
                        ) =>
                            setBrightness(
                                Number(
                                    event
                                        .target
                                        .value,
                                ),
                            )
                        }
                        aria-label="Brilho da interface"
                    />
                </div>


                <div className="quick-control-group">
                    <div className="quick-control-heading">
                        <div>
                            <strong>
                                Transparência
                            </strong>

                            <span>
                                Intensidade do glass
                            </span>
                        </div>

                        <span className="quick-control-value">
                            {glassOpacity}%
                        </span>
                    </div>

                    <input
                        className="quick-control-range"
                        type="range"
                        min="35"
                        max="95"
                        style={{
                            '--range-progress':
                                `${glassProgress}%`,
                        }}
                        value={
                            glassOpacity
                        }
                        onChange={(
                            event,
                        ) =>
                            setGlassOpacity(
                                Number(
                                    event
                                        .target
                                        .value,
                                ),
                            )
                        }
                        aria-label="Opacidade do glass"
                    />
                </div>
            </div>
        </aside>
    )
}

export default QuickControls