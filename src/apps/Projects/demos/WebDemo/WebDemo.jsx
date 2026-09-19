import {
    ExternalLink,
    MonitorPlay,
} from 'lucide-react'

import './WebDemo.css'


function WebDemo({
    project,
}) {
    const demoUrl =
        project.demo?.url


    /* === ABRIR EM NOVA ABA === */
    const openDemo =
        () => {
            if (!demoUrl) {
                return
            }

            window.open(
                demoUrl,
                '_blank',
                'noopener,noreferrer',
            )
        }


    /* === SEM DEMONSTRAÇÃO === */
    if (!demoUrl) {
        return (
            <div className="web-demo web-demo-empty">
                <div className="web-demo-empty-icon">
                    <MonitorPlay
                        size={22}
                        strokeWidth={1.8}
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


    return (
        <div className="web-demo">

            {/* === CABEÇALHO === */}
            <header className="web-demo-header">
                <div className="web-demo-title">
                    <span className="web-demo-icon">
                        <MonitorPlay
                            size={17}
                            strokeWidth={1.8}
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
                >
                    <ExternalLink
                        size={14}
                        strokeWidth={1.8}
                    />

                    Abrir
                </button>
            </header>


            {/* === APLICAÇÃO === */}
            <div className="web-demo-view">
                <iframe
                    className="web-demo-frame"
                    src={
                        demoUrl
                    }
                    title={`Demonstração de ${project.title}`}
                />
            </div>
        </div>
    )
}


export default WebDemo