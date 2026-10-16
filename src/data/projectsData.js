import {
    CloudSun,
    Gamepad2,
    LogIn,
    ShoppingCart,
} from 'lucide-react'


const BASE_URL =
    import.meta.env.BASE_URL


const projectsData = [
    {
        repository: 'API-Clima',
        id: 'api-clima',
        // Data pública de criação do repositório; fallback para indisponibilidade da API.
        createdAt: '2026-08-27T20:40:52Z',
        screenshot: null, // URL de uma captura real ou GIF do projeto.
        title: 'API Clima',

        description:
            'API desenvolvida em Spring Boot para consulta de informações climáticas.',

        technologies: [
            'Java',
            'Spring Boot',
            'API REST',
        ],

        demoType: 'terminal',

        demo: {
            mode: 'simple',
            command: 'curl GET /clima',

            output: `HTTP/1.1 200 OK

{
    "cidade": "Belo Horizonte",
    "temperatura": 27.4,
    "umidade": 51,
    "vento": 12.3,
    "direcaoVento": 135,
    "temperaturaMaxima": 29.1,
    "temperaturaMinima": 18.7
}`,
        },

        icon: CloudSun,
        featured: true,
    },

    {
        repository: 'Carrinho-Compras-POO',
        id: 'carrinho-compras',
        // Data pública de criação do repositório; fallback para indisponibilidade da API.
        createdAt: '2026-09-08T21:17:02Z',
        screenshot: null, // URL de uma captura real ou GIF do projeto.
        title: 'Carrinho de Compras',

        description:
            'Projeto acadêmico aplicando conceitos de Programação Orientada a Objetos.',

        technologies: [
            'Java',
            'POO',
        ],

        demoType: 'terminal',

        demo: {
            mode: 'cart',
            command: 'java Main',
        },

        icon: ShoppingCart,
        featured: true,
    },

    {
        repository: 'Login-PUC',
        id: 'login-puc',
        // Data pública de criação do repositório; fallback para indisponibilidade da API.
        createdAt: '2026-09-10T20:57:16Z',
        screenshot: null, // URL de uma captura real ou GIF do projeto.
        title: 'Login PUC',

        description:
            'Sistema web de autenticação desenvolvido com Spring Boot.',

        technologies: [
            'Java',
            'Spring Boot',
            'HTML',
            'CSS',
        ],

        demoType: 'web',

        demo: {
            url:
                `${BASE_URL}projects/web/login-puc/index.html`,
        },

        icon: LogIn,
        featured: true,
    },

    {
        repository: 'SnakePy',
        id: 'snakepy',
        // Data pública de criação do repositório; fallback para indisponibilidade da API.
        createdAt: '2026-05-27T19:43:49Z',
        screenshot: null, // URL de uma captura real ou GIF do projeto.
        title: 'SnakePy',

        description:
            'Jogo Snake desenvolvido em Python utilizando Pygame.',

        technologies: [
            'Python',
            'Pygame',
            'Pytest',
        ],

        demoType: 'media',

        demo: {
            video: null,

            images: [],
        },

        icon: Gamepad2,
        featured: true,
    },
]


/* === REPOSITÓRIOS OCULTOS === */
const hiddenGithubRepositories = [
    'warlleyz',
    'Ambiente-de-Teste',
]


export {
    hiddenGithubRepositories,
}

export default projectsData