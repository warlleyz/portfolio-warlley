import { BriefcaseBusiness, ExternalLink, GraduationCap } from 'lucide-react'
import './Experiences.css'

// Inclua novas experiências aqui, mantendo apenas informações verificadas.
const experiences = [
    {
        id: 'puc-minas',
        institution: 'PUC Minas',
        role: 'Estudante de Engenharia de Software',
        period: '2º período — em andamento',
        icon: GraduationCap,
        description: 'Formação em Engenharia de Software com aprendizado prático em programação, desenvolvimento web, orientação a objetos, APIs e backend.',
        activities: [
            'Desenvolvimento de projetos acadêmicos e exercícios para consolidar lógica de programação e orientação a objetos.',
            'Estudo de Java, Spring Boot, integração de aplicações e fundamentos de banco de dados.',
            'Uso de Git e GitHub para organizar e versionar código.',
        ],
    },
    {
        id: 'ws-os',
        institution: 'Projeto pessoal — WS OS',
        role: 'Desenvolvimento do portfólio profissional',
        period: 'Em andamento',
        icon: BriefcaseBusiness,
        description: 'Construção de um portfólio interativo inspirado em um sistema operacional, reunindo apresentação profissional, projetos e canais de contato.',
        activities: [
            'Desenvolvimento da interface com React, JavaScript e CSS.',
            'Implementação de janelas, navegação por aplicativos e temas claro e escuro.',
            'Integração com dados públicos do GitHub para apresentar os projetos.',
        ],
        href: 'https://github.com/warlleyz/portfolio-warlley',
    },
]

function Experiences() {
    return (
        <div className="experiences">
            <header className="experiences-intro">
                <span className="experiences-eyebrow">Trajetória e aprendizado</span>
                <h1>Experiências</h1>
                <p>Atividades acadêmicas e projetos pessoais que fazem parte da minha formação em desenvolvimento de software.</p>
            </header>

            <ol className="experiences-timeline" aria-label="Experiências acadêmicas e pessoais">
                {experiences.map(({ id, institution, role, period, icon: Icon, description, activities, href }) => (
                    <li className="experiences-item" key={id}>
                        <article className="experiences-card" aria-labelledby={`experience-${id}`}>
                            <div className="experiences-card-header">
                                <span className="experiences-icon"><Icon size={22} aria-hidden="true" /></span>
                                <div>
                                    <p className="experiences-institution">{institution}</p>
                                    <h2 id={`experience-${id}`}>{role}</h2>
                                    <p className="experiences-period">{period}</p>
                                </div>
                            </div>
                            <p>{description}</p>
                            <ul>
                                {activities.map((activity) => <li key={activity}>{activity}</li>)}
                            </ul>
                            {href && (
                                <a href={href} target="_blank" rel="noopener noreferrer">
                                    Ver repositório <ExternalLink size={14} aria-hidden="true" />
                                </a>
                            )}
                        </article>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default Experiences
