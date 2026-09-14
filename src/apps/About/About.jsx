import {
    BookOpen,
    Code2,
    Database,
    GitBranch,
    Layers3,
    Rocket,
    Wrench,
} from 'lucide-react'

import './About.css'

function About() {
    const studying = [
        'Java',
        'Spring Boot',
        'APIs REST',
        'Docker',
        'JavaScript',
        'HTML',
        'CSS',
        'Python',
        'PHP',
        'Figma',
    ]

    const knowledgeGroups = [
        {
            title: 'Desenvolvimento',
            icon: <Code2 size={18} />,
            items: [
                'Programação Orientada a Objetos',
                'Lógica de Programação',
                'Desenvolvimento Web',
                'Estruturação de aplicações backend',
            ],
        },
        {
            title: 'Integração',
            icon: <Layers3 size={18} />,
            items: [
                'Criação e consumo de APIs REST',
                'Spring Boot',
                'Maven',
                'Integração entre aplicações',
            ],
        },
        {
            title: 'Ferramentas',
            icon: <Wrench size={18} />,
            items: [
                'Git',
                'GitHub',
                'Docker',
                'Figma',
            ],
        },
        {
            title: 'Dados',
            icon: <Database size={18} />,
            items: [
                'Modelagem de dados',
                'Manipulação de dados',
                'Organização de informações',
                'Fundamentos de banco de dados',
            ],
        },
    ]

    return (
        <div className="about">
            <section className="about-profile">
                <div className="about-photo-wrapper">
                    <img
                        className="about-photo"
                        src="/images/profile.jpg"
                        alt="Foto de Warlley Silva"
                    />
                </div>

                <div className="about-profile-content">
                    <span className="about-eyebrow">
                        Estudante de Engenharia de Software
                    </span>

                    <h1>Warlley Silva</h1>

                    <p>
                        Estudante de Engenharia de Software na PUC Minas,
                        interessado em desenvolvimento de sistemas, automação,
                        gerenciamento de dados e inteligência artificial.
                    </p>

                    <p>
                        Gosto de aprender na prática, desenvolvendo projetos que
                        me ajudam a entender como diferentes tecnologias podem
                        trabalhar juntas para criar soluções funcionais.
                    </p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section-title">
                    <BookOpen size={19} />

                    <div>
                        <span>Apresentação</span>
                        <h2>Quem sou</h2>
                    </div>
                </div>

                <div className="about-text">
                    <p>
                        Atualmente estou no 2º período de Engenharia de Software
                        na PUC Minas e venho construindo minha base em programação,
                        desenvolvimento web, orientação a objetos, APIs e backend.
                    </p>

                    <p>
                        Tenho interesse em entender não apenas como escrever código,
                        mas também como estruturar sistemas, conectar diferentes
                        serviços e transformar ideias em aplicações reais.
                    </p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-section-title">
                    <Rocket size={19} />

                    <div>
                        <span>Aprendizado</span>
                        <h2>O que estou estudando</h2>
                    </div>
                </div>

                <div className="about-tags">
                    {studying.map((technology) => (
                        <span key={technology}>
                            {technology}
                        </span>
                    ))}
                </div>
            </section>

            <section className="about-section">
                <div className="about-section-title">
                    <GitBranch size={19} />

                    <div>
                        <span>Base atual</span>
                        <h2>Conhecimentos</h2>
                    </div>
                </div>

                <div className="about-knowledge-grid">
                    {knowledgeGroups.map((group) => (
                        <article
                            className="about-knowledge-card"
                            key={group.title}
                        >
                            <div className="about-knowledge-header">
                                <div className="about-knowledge-icon">
                                    {group.icon}
                                </div>

                                <h3>{group.title}</h3>
                            </div>

                            <ul>
                                {group.items.map((item) => (
                                    <li key={item}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            <section className="about-section about-goals">
                <div className="about-section-title">
                    <Rocket size={19} />

                    <div>
                        <span>Próximos passos</span>
                        <h2>Objetivos</h2>
                    </div>
                </div>

                <div className="about-text">
                    <p>
                        Meu objetivo é continuar evoluindo tecnicamente por meio
                        de projetos acadêmicos e pessoais, adquirindo cada vez
                        mais experiência prática no desenvolvimento de software.
                    </p>

                    <p>
                        Busco uma oportunidade de estágio onde eu possa aplicar
                        o que venho estudando, aprender com profissionais da área
                        e participar do desenvolvimento de soluções reais.
                    </p>

                    <p>
                        No longo prazo, quero aprofundar meus conhecimentos em
                        desenvolvimento de sistemas, automação, integração de
                        aplicações e gerenciamento de dados.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default About