import {
    ArrowUpRight,
    CloudSun,
    ExternalLink,
    GitBranch,
    LogIn,
    ShoppingCart,
    SunMedium,
} from 'lucide-react'

import './Projects.css'

function Projects({ onOpenProject }) {
    const projects = [
        {
            id: 'api-clima',
            title: 'API Clima',
            description:
                'API desenvolvida com Spring Boot consumindo dados meteorológicos da Open-Meteo.',
            technologies: ['Java', 'Spring Boot', 'API REST'],
            type: 'terminal',
            github: 'https://github.com/warlleyz',
            icon: <CloudSun size={22} />,
        },
        {
            id: 'carrinho-compras',
            title: 'Carrinho de Compras',
            description:
                'Projeto em Java focado em orientação a objetos e gerenciamento de produtos.',
            technologies: ['Java', 'POO'],
            type: 'terminal',
            github: 'https://github.com/warlleyz',
            icon: <ShoppingCart size={22} />,
        },
        {
            id: 'login-puc',
            title: 'Login PUC',
            description:
                'Aplicação web com páginas de login e cadastro utilizando Spring Boot.',
            technologies: ['Java', 'Spring Boot', 'HTML', 'CSS'],
            type: 'web',
            github: 'https://github.com/warlleyz',
            icon: <LogIn size={22} />,
        },
        {
            id: 'geosolar',
            title: 'GeoSolar',
            description:
                'Conceito de plataforma para análise do potencial de regiões para instalação de energia solar.',
            technologies: ['UI/UX', 'Figma', 'Web'],
            type: 'details',
            github: 'https://github.com/warlleyz',
            icon: <SunMedium size={22} />,
        },
    ]

    const openGithub = (event, url) => {
        event.stopPropagation()

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
                    {projects.length} projetos
                </span>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <article
                        key={project.id}
                        className="project-card"
                    >
                        <div className="project-card-top">
                            <div className="project-icon">
                                {project.icon}
                            </div>

                            <ArrowUpRight
                                className="project-arrow"
                                size={18}
                            />
                        </div>

                        <div className="project-content">
                            <h2>{project.title}</h2>

                            <p>{project.description}</p>
                        </div>

                        <div className="project-technologies">
                            {project.technologies.map(
                                (technology) => (
                                    <span key={technology}>
                                        {technology}
                                    </span>
                                ),
                            )}
                        </div>

                        <div className="project-actions">
                            <button
                                type="button"
                                className="project-button project-button-secondary"
                                onClick={(event) =>
                                    openGithub(event, project.github)
                                }
                            >
                                <GitBranch size={15} />
                                GitHub
                            </button>

                            <button
                                type="button"
                                className="project-button project-button-primary"
                                onClick={() =>
                                    onOpenProject?.(project)
                                }
                            >
                                <ExternalLink size={15} />
                                Abrir
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default Projects