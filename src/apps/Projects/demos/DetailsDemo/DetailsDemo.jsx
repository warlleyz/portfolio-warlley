import {
    ExternalLink,
    GitBranch,
} from 'lucide-react'

import './DetailsDemo.css'

function DetailsDemo({ project }) {
    const features = project.details?.features ?? []

    const openLink = (url) => {
        window.open(
            url,
            '_blank',
            'noopener,noreferrer',
        )
    }

    return (
        <div className="details-demo">
            <div className="details-demo-header">
                <div>
                    <span className="details-demo-label">
                        Projeto
                    </span>

                    <h2>
                        {project.title}
                    </h2>

                    <p>
                        {project.description}
                    </p>
                </div>
            </div>

            <div className="details-demo-technologies">
                {project.technologies.map((technology) => (
                    <span key={technology}>
                        {technology}
                    </span>
                ))}
            </div>

            {features.length > 0 && (
                <section className="details-demo-section">
                    <h3>
                        Funcionalidades
                    </h3>

                    <ul>
                        {features.map((feature) => (
                            <li key={feature}>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="details-demo-actions">
                {project.github && (
                    <button
                        type="button"
                        className="details-demo-button"
                        onClick={() =>
                            openLink(project.github)
                        }
                    >
                        <GitBranch
                            size={16}
                            strokeWidth={1.8}
                        />

                        GitHub
                    </button>
                )}

                {project.details?.link && (
                    <button
                        type="button"
                        className="details-demo-button details-demo-button-primary"
                        onClick={() =>
                            openLink(project.details.link)
                        }
                    >
                        <ExternalLink
                            size={16}
                            strokeWidth={1.8}
                        />

                        Abrir
                    </button>
                )}
            </div>
        </div>
    )
}

export default DetailsDemo