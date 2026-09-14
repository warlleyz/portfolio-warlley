import {
    ExternalLink,
    GitBranch,
} from 'lucide-react'

import TerminalDemo from './demos/TerminalDemo/TerminalDemo'
import WebDemo from './demos/WebDemo/WebDemo'
import MediaDemo from './demos/MediaDemo/MediaDemo'
import DetailsDemo from './demos/DetailsDemo/DetailsDemo'

import './ProjectDemo.css'

function ProjectDemo({ project }) {
    if (!project) {
        return (
            <p>
                Projeto não encontrado.
            </p>
        )
    }

    const openGithub = () => {
        if (!project.github) {
            return
        }

        window.open(
            project.github,
            '_blank',
            'noopener,noreferrer',
        )
    }

    const renderDemo = () => {
        switch (project.demoType) {
            case 'terminal':
                return (
                    <TerminalDemo
                        project={project}
                    />
                )

            case 'web':
                return (
                    <WebDemo
                        project={project}
                    />
                )

            case 'media':
                return (
                    <MediaDemo
                        project={project}
                    />
                )

            case 'details':
                return (
                    <DetailsDemo
                        project={project}
                    />
                )

            default:
                return (
                    <p>
                        Tipo de demonstração não suportado.
                    </p>
                )
        }
    }

    return (
        <div className="project-demo">
            <div className="project-demo-notice">
                <div className="project-demo-notice-content">
                    <span className="project-demo-badge">
                        Demo
                    </span>

                    <div>
                        <strong>
                            Demonstração do projeto
                        </strong>

                        <p>
                            Esta versão foi adaptada para funcionar
                            dentro do portfólio. O projeto completo
                            e o código-fonte estão disponíveis no
                            GitHub.
                        </p>
                    </div>
                </div>

                {project.github && (
                    <button
                        type="button"
                        className="project-demo-github"
                        onClick={openGithub}
                    >
                        <GitBranch
                            size={16}
                            strokeWidth={1.8}
                        />

                        Ver projeto

                        <ExternalLink
                            size={14}
                            strokeWidth={1.8}
                        />
                    </button>
                )}
            </div>

            <div className="project-demo-content">
                {renderDemo()}
            </div>
        </div>
    )
}

export default ProjectDemo