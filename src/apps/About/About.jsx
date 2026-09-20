import {
    BookOpen,
    Code2,
    Database,
    GitBranch,
    GraduationCap,
    Layers3,
    MapPin,
    Rocket,
    Wrench,
} from 'lucide-react'

import './About.css'


/* === CONFIGURAÇÃO === */
const BASE_URL =
    import.meta.env.BASE_URL

const PROFILE_IMAGE =
    `${BASE_URL}assets/profile/profile.jpg`


/* === TECNOLOGIAS EM ESTUDO === */
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


/* === GRUPOS DE CONHECIMENTO === */
const knowledgeGroups = [
    {
        title:
            'Desenvolvimento',

        icon:
            Code2,

        items: [
            'Programação Orientada a Objetos',
            'Lógica de Programação',
            'Desenvolvimento Web',
            'Estruturação de aplicações backend',
        ],
    },

    {
        title:
            'Integração',

        icon:
            Layers3,

        items: [
            'Criação e consumo de APIs REST',
            'Spring Boot',
            'Maven',
            'Integração entre aplicações',
        ],
    },

    {
        title:
            'Ferramentas',

        icon:
            Wrench,

        items: [
            'Git',
            'GitHub',
            'Docker',
            'Figma',
        ],
    },

    {
        title:
            'Dados',

        icon:
            Database,

        items: [
            'Modelagem de dados',
            'Manipulação de dados',
            'Organização de informações',
            'Fundamentos de banco de dados',
        ],
    },
]


function About() {
    return (
        <div className="about">

            {/* === PERFIL === */}
            <section className="about-profile">
                <div className="about-photo-wrapper">
                    <img
                        className="about-photo"
                        src={
                            PROFILE_IMAGE
                        }
                        alt="Foto de Warlley Silva"
                    />
                </div>

                <div className="about-profile-content">
                    <span className="about-eyebrow">
                        Estudante de Engenharia de Software
                    </span>

                    <h1>
                        Warlley Silva
                    </h1>

                    <p>
                        Estudante de Engenharia de Software
                        na PUC Minas, interessado em
                        desenvolvimento de sistemas,
                        automação, gerenciamento de dados
                        e inteligência artificial.
                    </p>

                    <div className="about-profile-meta">
                        <span>
                            <GraduationCap
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            PUC Minas
                        </span>

                        <span>
                            <MapPin
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            Minas Gerais
                        </span>
                    </div>
                </div>
            </section>


            {/* === VISÃO GERAL === */}
            <div className="about-overview-grid">

                {/* ----- QUEM SOU ----- */}
                <section className="about-section about-introduction">
                    <div className="about-section-title">
                        <BookOpen
                            size={18}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        <div>
                            <span>
                                Apresentação
                            </span>

                            <h2>
                                Quem sou
                            </h2>
                        </div>
                    </div>

                    <div className="about-text">
                        <p>
                            Atualmente estou no 2º período
                            de Engenharia de Software na
                            PUC Minas e venho construindo
                            minha base em programação,
                            desenvolvimento web, orientação
                            a objetos, APIs e backend.
                        </p>

                        <p>
                            Tenho interesse em entender não
                            apenas como escrever código,
                            mas também como estruturar sistemas,
                            conectar diferentes serviços e
                            transformar ideias em aplicações
                            funcionais.
                        </p>

                        <p>
                            Gosto de aprender na prática,
                            desenvolvendo projetos que me
                            ajudam a compreender como diferentes
                            tecnologias podem trabalhar juntas
                            na construção de soluções reais.
                        </p>
                    </div>
                </section>


                {/* ----- ESTUDANDO ----- */}
                <section className="about-section about-learning">
                    <div className="about-section-title">
                        <Rocket
                            size={18}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        <div>
                            <span>
                                Aprendizado
                            </span>

                            <h2>
                                O que estou estudando
                            </h2>
                        </div>
                    </div>

                    <p className="about-learning-description">
                        Tecnologias e conceitos que fazem
                        parte dos meus estudos e projetos atuais.
                    </p>

                    <div className="about-tags">
                        {studying.map(
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
            </div>


            {/* === CONHECIMENTOS === */}
            <section className="about-section about-knowledge">
                <div className="about-section-title">
                    <GitBranch
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <div>
                        <span>
                            Base atual
                        </span>

                        <h2>
                            Conhecimentos
                        </h2>
                    </div>
                </div>

                <div className="about-knowledge-grid">
                    {knowledgeGroups.map(
                        (group) => {
                            const Icon =
                                group.icon

                            return (
                                <article
                                    className="about-knowledge-card"
                                    key={
                                        group.title
                                    }
                                >
                                    <div className="about-knowledge-header">
                                        <span className="about-knowledge-icon">
                                            <Icon
                                                size={17}
                                                strokeWidth={1.8}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <h3>
                                            {
                                                group.title
                                            }
                                        </h3>
                                    </div>

                                    <ul>
                                        {group.items.map(
                                            (item) => (
                                                <li
                                                    key={
                                                        item
                                                    }
                                                >
                                                    {
                                                        item
                                                    }
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </article>
                            )
                        },
                    )}
                </div>
            </section>


            {/* === OBJETIVOS === */}
            <section className="about-section about-goals">
                <div className="about-section-title">
                    <Rocket
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <div>
                        <span>
                            Próximos passos
                        </span>

                        <h2>
                            Objetivos
                        </h2>
                    </div>
                </div>

                <div className="about-goals-grid">
                    <p>
                        Continuar evoluindo tecnicamente
                        por meio de projetos acadêmicos e
                        pessoais, adquirindo experiência
                        prática no desenvolvimento de software.
                    </p>

                    <p>
                        Buscar uma oportunidade de estágio
                        onde eu possa aplicar meus conhecimentos,
                        aprender com profissionais da área
                        e participar de soluções reais.
                    </p>

                    <p>
                        Aprofundar meus conhecimentos em
                        desenvolvimento de sistemas, automação,
                        integração de aplicações e gerenciamento
                        de dados.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default About