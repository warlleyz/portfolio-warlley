import {
    CloudSun,
    Gamepad2,
    LogIn,
    ShoppingCart,
} from 'lucide-react'

const projectsData = [
    {
        id: 'api-clima',
        title: 'API Clima',
        description:
            'API desenvolvida com Spring Boot consumindo dados meteorológicos da Open-Meteo.',

        technologies: [
            'Java',
            'Spring Boot',
            'API REST',
        ],

        demoType: 'terminal',

        demo: {},

        github:
            'https://github.com/warlleyz',

        icon: CloudSun,
    },

    {
        id: 'carrinho-compras',
        title: 'Carrinho de Compras',
        description:
            'Projeto em Java focado em orientação a objetos e gerenciamento de produtos.',

        technologies: [
            'Java',
            'POO',
        ],

        demoType: 'terminal',

        demo: {},

        github:
            'https://github.com/warlleyz',

        icon: ShoppingCart,
    },

    {
        id: 'login-puc',
        title: 'Login PUC',
        description:
            'Aplicação web com páginas de login e cadastro utilizando Spring Boot.',

        technologies: [
            'Java',
            'Spring Boot',
            'HTML',
            'CSS',
        ],

        demoType: 'web',

        demo: {
            url:
                `${import.meta.env.BASE_URL}projects/web/login-puc/index.html`,
        },

        github:
            'https://github.com/warlleyz',

        icon: LogIn,
    },

    {
        id: 'snakepy',
        title: 'SnakePy',
        description:
            'Jogo inspirado no clássico Snake, desenvolvido em Python com Pygame.',

        technologies: [
            'Python',
            'Pygame',
            'Pytest',
        ],

        demoType: 'media',

        demo: {
            video: '',
            images: [],
        },

        github:
            'https://github.com/warlleyz/SnakePy',

        icon: Gamepad2,
    },
]

export default projectsData