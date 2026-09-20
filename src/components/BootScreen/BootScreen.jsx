import {
    useEffect,
    useState,
} from 'react'

import './BootScreen.css'


/* === CONFIGURAÇÃO === */
const BOOT_STEPS = [
    {
        status: 'Inicializando sistema',
        progress: 28,
    },

    {
        status: 'Carregando interface',
        progress: 64,
    },

    {
        status: 'Preparando ambiente',
        progress: 92,
    },
]

const STEP_INTERVAL = 380

const BASE_URL =
    import.meta.env.BASE_URL

const BRANDING_URL =
    `${BASE_URL}assets/branding/`


function BootScreen({
    theme,
    leaving = false,
}) {
    const [
        currentStep,
        setCurrentStep,
    ] = useState(
        () => {
            const reducedMotion =
                window.matchMedia(
                    '(prefers-reduced-motion: reduce)',
                ).matches

            return reducedMotion
                ? BOOT_STEPS.length - 1
                : 0
        },
    )


    /* === ASSETS === */
    const logoSource =
        theme === 'dark'
            ? `${BRANDING_URL}ws-os-dark.png`
            : `${BRANDING_URL}ws-os-light.png`


    /* === ESTADO VISUAL === */
    const screenClassName = [
        'boot-screen',
        `boot-screen-${theme}`,

        leaving
            ? 'boot-screen-leaving'
            : '',
    ]
        .filter(Boolean)
        .join(' ')

    const currentBootStep =
        BOOT_STEPS[currentStep]


    /* === PROGRESSO DA INICIALIZAÇÃO === */
    useEffect(() => {
        const reducedMotion =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches

        if (
            reducedMotion
        ) {
            return
        }

        const timers =
            BOOT_STEPS
                .slice(1)
                .map(
                    (_, index) =>
                        setTimeout(() => {
                            setCurrentStep(
                                index + 1,
                            )
                        }, STEP_INTERVAL * (index + 1)),
                )

        return () => {
            timers.forEach(
                clearTimeout,
            )
        }
    }, [])


    /* === RENDERIZAÇÃO === */
    return (
        <div
            className={
                screenClassName
            }
            aria-live="polite"
            aria-busy={
                !leaving
            }
        >
            <main className="boot-content">
                <img
                    src={
                        logoSource
                    }
                    alt="WS OS"
                    className="boot-logo"
                    draggable="false"
                />

                <div className="boot-loading">
                    <span className="boot-status">
                        {
                            currentBootStep.status
                        }
                    </span>

                    <div
                        className="boot-progress"
                        role="progressbar"
                        aria-label="Inicialização do WS OS"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={
                            currentBootStep.progress
                        }
                    >
                        <span
                            className="boot-progress-bar"
                            style={{
                                width:
                                    `${currentBootStep.progress}%`,
                            }}
                        />
                    </div>
                </div>
            </main>

            <footer className="boot-footer">
                <span>
                    WS OS
                </span>

                <span
                    aria-hidden="true"
                >
                    1.0
                </span>
            </footer>
        </div>
    )
}

export default BootScreen