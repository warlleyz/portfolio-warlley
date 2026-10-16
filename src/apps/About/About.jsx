import { useState } from 'react'

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


const english = {
    "Foto de Warlley Silva": "Photo of Warlley Silva",
    "Estudante de Engenharia de Software": "Software Engineering Student",
    "Estudante de Engenharia de Software na PUC Minas, interessado em desenvolvimento de sistemas, automação, gerenciamento de dados e inteligência artificial.": "Software Engineering student at PUC Minas, interested in software development, automation, data management, and artificial intelligence.",
    "Apresentação": "Introduction",
    "Quem sou": "About me",
    "Atualmente estou no 2º período de Engenharia de Software na PUC Minas e venho construindo minha base em programação, desenvolvimento web, orientação a objetos, APIs e backend.": "I am currently in my second semester of Software Engineering at PUC Minas, building a foundation in programming, web development, object-oriented programming, APIs, and backend development.",
    "Tenho interesse em entender não apenas como escrever código, mas também como estruturar sistemas, conectar diferentes serviços e transformar ideias em aplicações funcionais.": "I am interested in understanding how to write code, design systems, connect different services, and turn ideas into working applications.",
    "Gosto de aprender na prática, desenvolvendo projetos que me ajudam a compreender como diferentes tecnologias podem trabalhar juntas na construção de soluções reais.": "I enjoy learning by doing, developing projects that help me understand how different technologies work together to build real solutions.",
    "Aprendizado": "Learning",
    "O que estou estudando": "What I am studying",
    "Tecnologias e conceitos que fazem parte dos meus estudos e projetos atuais.": "Technologies and concepts that are part of my current studies and projects.",
    "Base atual": "Current foundation",
    "Conhecimentos": "Knowledge",
    "Desenvolvimento": "Development",
    "Programação Orientada a Objetos": "Object-Oriented Programming",
    "Lógica de Programação": "Programming fundamentals",
    "Desenvolvimento Web": "Web development",
    "Estruturação de aplicações backend": "Backend application design",
    "Integração": "Integration",
    "Criação e consumo de APIs REST": "Building and consuming REST APIs",
    "Integração entre aplicações": "Application integration",
    "Ferramentas": "Tools",
    "Dados": "Data",
    "Modelagem de dados": "Data modeling",
    "Manipulação de dados": "Data manipulation",
    "Organização de informações": "Information organization",
    "Fundamentos de banco de dados": "Database fundamentals",
    "APIs REST": "REST APIs",
    "Próximos passos": "Next steps",
    "Objetivos": "Goals",
    "Continuar evoluindo tecnicamente por meio de projetos acadêmicos e pessoais, adquirindo experiência prática no desenvolvimento de software.": "Continue developing my technical skills through academic and personal projects, gaining practical experience in software development.",
    "Buscar uma oportunidade de estágio onde eu possa aplicar meus conhecimentos, aprender com profissionais da área e participar de soluções reais.": "Find an internship where I can apply my knowledge, learn from professionals, and contribute to real solutions.",
    "Aprofundar meus conhecimentos em desenvolvimento de sistemas, automação, integração de aplicações e gerenciamento de dados.": "Deepen my knowledge of software development, automation, application integration, and data management."
}

const LANGUAGE_KEY = 'ws-os:about-language'

function getInitialLanguage() {
    try {
        return localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'pt-BR'
    } catch {
        return 'pt-BR'
    }
}

function About() {
    const [language, setLanguage] = useState(getInitialLanguage)
    const t = (text) => language === 'en' ? (english[text] ?? text) : text

    const changeLanguage = (nextLanguage) => {
        setLanguage(nextLanguage)
        try {
            localStorage.setItem(LANGUAGE_KEY, nextLanguage)
        } catch {
            // A troca continua funcionando se o armazenamento estiver indisponível.
        }
    }

    return (
        <div className="about" lang={language}>
            <div className="about-language" role="group" aria-label={language === 'en' ? 'About me language' : 'Idioma do Sobre Mim'}>
                <button type="button" lang="pt-BR" aria-pressed={language === 'pt-BR'} onClick={() => changeLanguage('pt-BR')}>Português</button>
                <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>English</button>
            </div>

            {/* === PERFIL === */}
            <section className="about-profile">
                <div className="about-photo-wrapper">
                    <img
                        className="about-photo"
                        src={
                            PROFILE_IMAGE
                        }
                        alt={t("Foto de Warlley Silva")}
                    />
                </div>

                <div className="about-profile-content">
                    <span className="about-eyebrow">{t("Estudante de Engenharia de Software")}</span>

                    <h1>
                        Warlley Silva
                    </h1>

                    <p>{t("Estudante de Engenharia de Software na PUC Minas, interessado em desenvolvimento de sistemas, automação, gerenciamento de dados e inteligência artificial.")}</p>

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
                            <span>{t("Apresentação")}</span>

                            <h2>{t("Quem sou")}</h2>
                        </div>
                    </div>

                    <div className="about-text">
                        <p>{t("Atualmente estou no 2º período de Engenharia de Software na PUC Minas e venho construindo minha base em programação, desenvolvimento web, orientação a objetos, APIs e backend.")}</p>

                        <p>{t("Tenho interesse em entender não apenas como escrever código, mas também como estruturar sistemas, conectar diferentes serviços e transformar ideias em aplicações funcionais.")}</p>

                        <p>{t("Gosto de aprender na prática, desenvolvendo projetos que me ajudam a compreender como diferentes tecnologias podem trabalhar juntas na construção de soluções reais.")}</p>
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
                            <span>{t("Aprendizado")}</span>

                            <h2>{t("O que estou estudando")}</h2>
                        </div>
                    </div>

                    <p className="about-learning-description">{t("Tecnologias e conceitos que fazem parte dos meus estudos e projetos atuais.")}</p>

                    <div className="about-tags">
                        {studying.map(
                            (technology) => (
                                <span
                                    key={t(technology)}
                                >
                                    {t(technology)}
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
                        <span>{t("Base atual")}</span>

                        <h2>{t("Conhecimentos")}</h2>
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
                                    key={t(group.title)}
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
                                            {t(group.title)}
                                        </h3>
                                    </div>

                                    <ul>
                                        {group.items.map(
                                            (item) => (
                                                <li
                                                    key={t(item)}
                                                >
                                                    {t(item)}
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
                        <span>{t("Próximos passos")}</span>

                        <h2>{t("Objetivos")}</h2>
                    </div>
                </div>

                <div className="about-goals-grid">
                    <p>{t("Continuar evoluindo tecnicamente por meio de projetos acadêmicos e pessoais, adquirindo experiência prática no desenvolvimento de software.")}</p>

                    <p>{t("Buscar uma oportunidade de estágio onde eu possa aplicar meus conhecimentos, aprender com profissionais da área e participar de soluções reais.")}</p>

                    <p>{t("Aprofundar meus conhecimentos em desenvolvimento de sistemas, automação, integração de aplicações e gerenciamento de dados.")}</p>
                </div>
            </section>
        </div>
    )
}

export default About