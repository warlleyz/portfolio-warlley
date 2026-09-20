import DetailsDemo from './demos/DetailsDemo/DetailsDemo'
import MediaDemo from './demos/MediaDemo/MediaDemo'
import TerminalDemo from './demos/TerminalDemo/TerminalDemo'
import WebDemo from './demos/WebDemo/WebDemo'

import './ProjectDemo.css'


/* === TIPOS COM DEMONSTRAÇÃO === */
const demoTypes =
    new Set([
        'terminal',
        'web',
        'media',
    ])


function ProjectDemo({
    project,
}) {
    const hasDemo =
        demoTypes.has(
            project.demoType,
        )


    /* === CONTEÚDO DA DEMONSTRAÇÃO === */
    const renderDemo =
        () => {
            switch (
            project.demoType
            ) {
                case 'terminal':
                    return (
                        <TerminalDemo
                            project={
                                project
                            }
                        />
                    )

                case 'web':
                    return (
                        <WebDemo
                            project={
                                project
                            }
                        />
                    )

                case 'media':
                    return (
                        <MediaDemo
                            project={
                                project
                            }
                        />
                    )

                case 'details':
                default:
                    return (
                        <DetailsDemo
                            project={
                                project
                            }
                        />
                    )
            }
        }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="project-demo">

            {/* === AVISO DA DEMONSTRAÇÃO === */}
            {hasDemo && (
                <section className="project-demo-notice">
                    <span className="project-demo-badge">
                        Demo
                    </span>

                    <div className="project-demo-notice-text">
                        <strong>
                            Demonstração do projeto
                        </strong>

                        <p>
                            Esta versão foi adaptada para funcionar
                            dentro do portfólio.
                        </p>
                    </div>
                </section>
            )}


            {/* === CONTEÚDO === */}
            <div className="project-demo-content">
                {
                    renderDemo()
                }
            </div>
        </div>
    )
}


export default ProjectDemo