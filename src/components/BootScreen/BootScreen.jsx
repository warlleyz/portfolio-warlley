import './BootScreen.css'

function BootScreen({
    theme,
    leaving = false,
}) {
    const logoSource =
        theme === 'dark'
            ? '/images/branding/ws-os-dark.png'
            : '/images/branding/ws-os-light.png'

    const screenClassName = [
        'boot-screen',
        `boot-screen-${theme}`,
        leaving
            ? 'boot-screen-leaving'
            : '',
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            className={
                screenClassName
            }
        >
            <div className="boot-content">
                <img
                    src={logoSource}
                    alt="WS"
                    className="boot-logo"
                    draggable="false"
                />

                <div className="boot-text">
                    <p className="boot-name">
                        Warlley Silva Baião Braga
                    </p>

                    <div className="boot-loading">
                        <span className="boot-status">
                            Inicializando sistema
                        </span>

                        <div
                            className="boot-loader"
                            role="status"
                            aria-label="Inicializando WS OS"
                        >
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                </div>
            </div>

            <span
                className="boot-version"
                aria-hidden="true"
            >
                WS OS
            </span>
        </div>
    )
}

export default BootScreen