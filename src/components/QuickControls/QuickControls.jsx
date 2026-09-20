import {
    useEffect,
    useRef,
} from 'react'

import {
    Moon,
    Sun,
} from 'lucide-react'

import './QuickControls.css'


/* === CONFIGURAÇÃO === */
const BRIGHTNESS_MIN = 75
const BRIGHTNESS_MAX = 105

const GLASS_MIN = 35
const GLASS_MAX = 95


/* === UTILITÁRIOS === */
const getRangeProgress = (
    value,
    min,
    max,
) => {
    return (
        (
            value - min
        ) /
        (
            max - min
        )
    ) * 100
}


function QuickControls({
    theme,
    toggleTheme,
    brightness,
    setBrightness,
    glassOpacity,
    setGlassOpacity,
    onClose,
}) {

    /* === REFERÊNCIAS === */
    const panelRef =
        useRef(null)


    /* === PREENCHIMENTO DOS SLIDERS === */
    const brightnessProgress =
        getRangeProgress(
            brightness,
            BRIGHTNESS_MIN,
            BRIGHTNESS_MAX,
        )

    const glassProgress =
        getRangeProgress(
            glassOpacity,
            GLASS_MIN,
            GLASS_MAX,
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
    }, [
        onClose,
    ])


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
    }, [
        onClose,
    ])


    /* === RENDERIZAÇÃO === */
    return (
        <aside
            ref={
                panelRef
            }
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

                {/* === TEMA === */}
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
                    aria-label={
                        theme === 'dark'
                            ? 'Alterar para tema claro'
                            : 'Alterar para tema escuro'
                    }
                >
                    <span className="quick-control-theme-icon">
                        {
                            theme === 'dark'
                                ? (
                                    <Moon
                                        size={19}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                )
                                : (
                                    <Sun
                                        size={19}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
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


                {/* === BRILHO === */}
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
                        min={
                            BRIGHTNESS_MIN
                        }
                        max={
                            BRIGHTNESS_MAX
                        }
                        value={
                            brightness
                        }
                        style={{
                            '--range-progress':
                                `${brightnessProgress}%`,
                        }}
                        onChange={(
                            event,
                        ) =>
                            setBrightness(
                                Number(
                                    event.target.value,
                                ),
                            )
                        }
                        aria-label="Brilho da interface"
                        aria-valuetext={
                            `${brightness}%`
                        }
                    />
                </div>


                {/* === TRANSPARÊNCIA === */}
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
                        min={
                            GLASS_MIN
                        }
                        max={
                            GLASS_MAX
                        }
                        value={
                            glassOpacity
                        }
                        style={{
                            '--range-progress':
                                `${glassProgress}%`,
                        }}
                        onChange={(
                            event,
                        ) =>
                            setGlassOpacity(
                                Number(
                                    event.target.value,
                                ),
                            )
                        }
                        aria-label="Opacidade do glass"
                        aria-valuetext={
                            `${glassOpacity}%`
                        }
                    />
                </div>
            </div>
        </aside>
    )
}

export default QuickControls