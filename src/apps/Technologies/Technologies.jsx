import {
    Code2,
    Database,
    ServerCog,
    Wrench,
} from 'lucide-react'

import './Technologies.css'


/* === TECNOLOGIAS PRINCIPAIS === */
const featuredTechnologies = [
    'Java',
    'Spring Boot',
    'JavaScript',
    'Docker',
    'Git',
    'APIs REST',
]


/* === GRUPOS === */
const technologyGroups = [
    {
        title:
            'Linguagens',

        description:
            'Base de programação utilizada em estudos, projetos web e aplicações backend.',

        icon:
            Code2,

        items: [
            'Java',
            'JavaScript',
            'Python',
            'PHP',
            'HTML',
            'CSS',
        ],
    },

    {
        title:
            'Backend e APIs',

        description:
            'Tecnologias utilizadas para estruturar aplicações, serviços e integrações.',

        icon:
            ServerCog,

        items: [
            'Spring Boot',
            'APIs REST',
            'Maven',
        ],
    },

    {
        title:
            'Ferramentas',

        description:
            'Ferramentas presentes no meu fluxo de desenvolvimento e organização de projetos.',

        icon:
            Wrench,

        items: [
            'Git',
            'GitHub',
            'Docker',
            'Postman',
        ],
    },

    {
        title:
            'Dados e Design',

        description:
            'Recursos utilizados para trabalhar com informações, visualização e interfaces.',

        icon:
            Database,

        items: [
            'Banco de Dados',
            'Power BI',
            'Figma',
        ],
    },
]


function Technologies() {
    return (
        <div className="technologies">

            {/* === CABEÇALHO === */}
            <header className="technologies-header">
                <span className="technologies-label">
                    Stack
                </span>

                <h1>
                    Tecnologias e ferramentas
                </h1>

                <p>
                    Tecnologias que venho utilizando
                    durante minha formação, estudos
                    e desenvolvimento de projetos.
                </p>
            </header>


            {/* === DESTAQUES === */}
            <section className="technologies-featured">
                <div className="technologies-featured-header">
                    <div>
                        <span>
                            Uso frequente
                        </span>

                        <h2>
                            Principais tecnologias
                        </h2>
                    </div>
                </div>

                <div className="technologies-featured-list">
                    {featuredTechnologies.map(
                        (technology) => (
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


            {/* === CATEGORIAS === */}
            <section className="technologies-grid">
                {technologyGroups.map(
                    (group) => {
                        const Icon =
                            group.icon

                        return (
                            <article
                                key={
                                    group.title
                                }
                                className="technology-card"
                            >
                                <div className="technology-card-header">
                                    <span className="technology-icon">
                                        <Icon
                                            size={18}
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div>
                                        <h2>
                                            {
                                                group.title
                                            }
                                        </h2>

                                        <p>
                                            {
                                                group.description
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="technology-items">
                                    {group.items.map(
                                        (item) => (
                                            <span
                                                key={
                                                    item
                                                }
                                            >
                                                {
                                                    item
                                                }
                                            </span>
                                        ),
                                    )}
                                </div>
                            </article>
                        )
                    },
                )}
            </section>
        </div>
    )
}

export default Technologies