import {
    Code2,
    Database,
    ServerCog,
    Wrench,
} from 'lucide-react'

import './Technologies.css'

const technologyGroups = [
    {
        title: 'Linguagens',
        icon: Code2,
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
        title: 'Backend e APIs',
        icon: ServerCog,
        items: [
            'Spring Boot',
            'APIs REST',
            'Maven',
        ],
    },
    {
        title: 'Ferramentas',
        icon: Wrench,
        items: [
            'Git',
            'GitHub',
            'Docker',
            'Postman',
        ],
    },
    {
        title: 'Dados e Design',
        icon: Database,
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
            <div className="technologies-header">
                <span className="technologies-label">
                    Tecnologias
                </span>

                <h1>
                    Conhecimentos e ferramentas
                </h1>

                <p>
                    Tecnologias que venho utilizando e estudando
                    durante minha formação e desenvolvimento de projetos.
                </p>
            </div>

            <div className="technologies-grid">
                {technologyGroups.map((group) => {
                    const Icon = group.icon

                    return (
                        <article
                            key={group.title}
                            className="technology-card"
                        >
                            <div className="technology-card-header">
                                <div className="technology-icon">
                                    <Icon
                                        size={20}
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <h2>
                                    {group.title}
                                </h2>
                            </div>

                            <div className="technology-items">
                                {group.items.map((item) => (
                                    <span key={item}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </article>
                    )
                })}
            </div>
        </div>
    )
}

export default Technologies