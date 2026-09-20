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
        title: 'API Clima',

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
        title: 'Carrinho de Compras',

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
        title: 'Login PUC',

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
        title: 'SnakePy',

        technologies: [
            'Python',
            'Pygame',
            'Pytest',
        ],

        demoType: 'media',

        demo: {
            video:
                `${BASE_URL}projects/media/snakepy/demo.mp4`,

            images: [
                `${BASE_URL}projects/media/snakepy/images/menu.png`,
                `${BASE_URL}projects/media/snakepy/images/game.png`,
            ],
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