import {
    Award,
    Code2,
    Cpu,
    FileText,
    Folder,
    Gamepad2,
    Mail,
    TerminalSquare,
    UserRound,
} from 'lucide-react'


const appsData = [
    {
        id: 'about',
        name: 'Sobre mim',
        icon: UserRound,
        desktop: true,
        menu: true,

        window: {
            width: 1080,
            height: 760,
            centered: true,
        },
    },

    {
        id: 'projects',
        name: 'Projetos',
        icon: Folder,
        desktop: true,
        menu: true,

        window: {
            width: 1000,
            height: 700,
            centered: true,
        },
    },

    {
        id: 'technologies',
        name: 'Tecnologias',
        icon: Cpu,
        desktop: true,
        menu: true,

        window: {
            width: 900,
            height: 565,
            centered: true,
        },
    },

    {
        id: 'certificates',
        name: 'Certificados',
        icon: Award,
        desktop: true,
        menu: true,

        window: {
            width: 1000,
            height: 720,
            centered: true,
        },
    },

    {
        id: 'contact',
        name: 'Contato',
        icon: Mail,
        desktop: true,
        menu: true,

        window: {
            width: 760,
            height: 380,
            centered: true,
        },
    },

    {
        id: 'resume',
        name: 'Currículo',
        icon: FileText,
        desktop: true,
        menu: true,

        window: {
            width: 1000,
            height: 760,
            centered: true,
        },
    },

    {
        id: 'terminal',
        name: 'Terminal',
        icon: TerminalSquare,
        desktop: true,
        menu: true,

        window: {
            width: 820,
            height: 520,
            centered: true,
        },
    },

    {
        id: 'stats',
        name: 'Estatísticas',
        icon: Code2,
        desktop: true,
        menu: true,

        window: {
            width: 900,
            height: 620,
            centered: true,
        },
    },

    {
        id: 'game',
        name: 'Snake',
        icon: Gamepad2,
        desktop: true,
        menu: true,

        window: {
            width: 920,
            height: 680,
            centered: true,
        },
    },
]


export default appsData