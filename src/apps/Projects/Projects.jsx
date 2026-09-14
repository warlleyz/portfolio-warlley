import {
    ExternalLink,
    GitBranch,
} from 'lucide-react'

import projectsData from '../../data/projectsData'

import './Projects.css'

function Projects({ onOpenProject }) {
    const openGithub = (url) => {
        window.open(
            url,
            '_blank',
            'noopener,noreferrer',
        )
    }

    return (
        <div className="projects">
            <div className="projects-header">
                <div>
                    <span className="projects-label">
                        Portfólio
                    </span>

                    <h1>Meus projetos</h1>

                    <p>
                        Alguns dos projetos acadêmicos e pessoais
                        que desenvolvi durante meus estudos.
                    </p>
                </div>

                <span className="projects-count">
                    {projectsData.length} projetos
                </span>
            </div>

            <div className="projects-grid">
                {projectsData.map((project) => {
                    const Icon = project.icon

                    return (
                        <article
                            key={project.id}
                            className="project-card"
                        >
                            <div className="project-card-top">
                                <div className="project-icon">
                                    <Icon
                                        size={22}
                                        strokeWidth={1.8}
                                    />
                                </div>
                            </div>

                            <div className="project-content">
                                <h2>{project.title}</h2>

                                <p>
                                    {project.description}
                                </p>
                            </div>

                            <div className="project-technologies">
                                {project.technologies.map((technology) => (
                                    <span key={technology}>
                                        {technology}
                                    </span>
                                ))}
                            </div>

                            <div className="project-actions">
                                <button
                                    type="button"
                                    className="project-button project-button-secondary"
                                    onClick={() => openGithub(project.github)}
                                >
                                    <GitBranch
                                        size={15}
                                        strokeWidth={1.8}
                                    />

                                    GitHub
                                </button>

                                <button
                                    type="button"
                                    className="project-button project-button-primary"
                                    onClick={() => onOpenProject?.(project)}
                                >
                                    <ExternalLink
                                        size={15}
                                        strokeWidth={1.8}
                                    />

                                    Ver demo
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>
        </div>
    )
}

export default Projects