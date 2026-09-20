import {
    CalendarDays,
    ExternalLink,
    FolderGit2,
    GitBranch,
    GitFork,
    Star,
} from 'lucide-react'

import './DetailsDemo.css'


/* === FORMATAR DATA === */
function formatDate(
    value,
) {
    if (
        !value
    ) {
        return null
    }

    const date =
        new Date(value)

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return null
    }

    return new Intl.DateTimeFormat(
        'pt-BR',
        {
            day:
                '2-digit',

            month:
                '2-digit',

            year:
                'numeric',
        },
    ).format(
        date,
    )
}


function DetailsDemo({
    project,
}) {

    /* === DADOS === */
    const features =
        project.details?.features ??
        []

    const technologies =
        project.technologies ??
        []

    const updatedDate =
        formatDate(
            project.pushedAt ??
            project.updatedAt,
        )


    /* === ABRIR LINK === */
    const openLink = (
        url,
    ) => {
        if (
            !url
        ) {
            return
        }

        window.open(
            url,
            '_blank',
            'noopener,noreferrer',
        )
    }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="details-demo">

            {/* === CABEÇALHO === */}
            <header className="details-demo-header">
                <div className="details-demo-title">
                    <span className="details-demo-icon">
                        <FolderGit2
                            size={18}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <span className="details-demo-label">
                            Repositório
                        </span>

                        <h2>
                            {
                                project.title
                            }
                        </h2>
                    </div>
                </div>


                <div className="details-demo-header-actions">
                    {project.language && (
                        <span className="details-demo-language">
                            {
                                project.language
                            }
                        </span>
                    )}

                    {project.github && (
                        <button
                            type="button"
                            className="details-demo-github"
                            onClick={() =>
                                openLink(
                                    project.github,
                                )
                            }
                            aria-label={
                                `Abrir ${project.title} no GitHub`
                            }
                        >
                            <GitBranch
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            Ver no GitHub
                        </button>
                    )}
                </div>
            </header>


            {/* === DESCRIÇÃO === */}
            <section className="details-demo-description">
                <span className="details-demo-section-label">
                    Sobre o projeto
                </span>

                <p>
                    {
                        project.description
                    }
                </p>
            </section>


            {/* === METADADOS DO GITHUB === */}
            <section className="details-demo-metadata">
                <div className="details-demo-meta-item">
                    <Star
                        size={15}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <div>
                        <strong>
                            {
                                project.stars ??
                                0
                            }
                        </strong>

                        <span>
                            Stars
                        </span>
                    </div>
                </div>


                <div className="details-demo-meta-item">
                    <GitFork
                        size={15}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <div>
                        <strong>
                            {
                                project.forks ??
                                0
                            }
                        </strong>

                        <span>
                            Forks
                        </span>
                    </div>
                </div>


                {updatedDate && (
                    <div className="details-demo-meta-item details-demo-meta-date">
                        <CalendarDays
                            size={15}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        <div>
                            <strong>
                                {
                                    updatedDate
                                }
                            </strong>

                            <span>
                                Última atualização
                            </span>
                        </div>
                    </div>
                )}
            </section>


            {/* === TECNOLOGIAS === */}
            {technologies.length > 0 && (
                <section className="details-demo-block">
                    <span className="details-demo-section-label">
                        Tecnologias
                    </span>

                    <div className="details-demo-technologies">
                        {technologies.map(
                            (
                                technology,
                            ) => (
                                <span
                                    key={
                                        technology
                                    }
                                >
                                    {
                                        technology
                                    }
                                </span>
                            ),
                        )}
                    </div>
                </section>
            )}


            {/* === INFORMAÇÕES === */}
            {features.length > 0 && (
                <section className="details-demo-block">
                    <span className="details-demo-section-label">
                        Informações
                    </span>

                    <ul className="details-demo-features">
                        {features.map(
                            (
                                feature,
                            ) => (
                                <li
                                    key={
                                        feature
                                    }
                                >
                                    {
                                        feature
                                    }
                                </li>
                            ),
                        )}
                    </ul>
                </section>
            )}


            {/* === AÇÃO EXTERNA === */}
            {project.details?.link && (
                <div className="details-demo-actions">
                    <button
                        type="button"
                        className="details-demo-button details-demo-button-primary"
                        onClick={() =>
                            openLink(
                                project.details.link,
                            )
                        }
                        aria-label={
                            `Abrir projeto ${project.title}`
                        }
                    >
                        <ExternalLink
                            size={15}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        Abrir projeto
                    </button>
                </div>
            )}
        </div>
    )
}


export default DetailsDemo