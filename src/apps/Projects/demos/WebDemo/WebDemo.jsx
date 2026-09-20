import {
    ExternalLink,
    MonitorPlay,
} from 'lucide-react'

import './WebDemo.css'


function WebDemo({
    project,
}) {
    
    /* === CONFIGURAÇÃO === */
    const demoUrl =
        project.demo?.url


    /* === ABRIR EM NOVA ABA === */
    const openDemo =
        () => {
            if (
                !demoUrl
            ) {
                return
            }

            window.open(
                demoUrl,
                '_blank',
                'noopener,noreferrer',
            )
        }


    /* === SEM DEMONSTRAÇÃO === */
    if (
        !demoUrl
    ) {
        return (
            <div className="web-demo web-demo-empty">
                <div className="web-demo-empty-icon">
                    <MonitorPlay
                        size={22}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <h2>
                        {
                            project.title
                        }
                    </h2>

                    <p>
                        Demonstração web ainda não configurada.
                    </p>
                </div>
            </div>
        )
    }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="web-demo">

            {/* === CABEÇALHO === */}
            <header className="web-demo-header">
                <div className="web-demo-title">
                    <span className="web-demo-icon">
                        <MonitorPlay
                            size={17}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <strong>
                            {
                                project.title
                            }
                        </strong>

                        <span>
                            Aplicação web
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="web-demo-open"
                    onClick={
                        openDemo
                    }
                    aria-label={
                        `Abrir ${project.title} em nova aba`
                    }
                >
                    <ExternalLink
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <span>
                        Abrir
                    </span>
                </button>
            </header>


            {/* === APLICAÇÃO === */}
            <div className="web-demo-view">
                <iframe
                    className="web-demo-frame"
                    src={
                        demoUrl
                    }
                    title={
                        `Demonstração de ${project.title}`
                    }
                    loading="lazy"
                />
            </div>
        </div>
    )
}


export default WebDemo