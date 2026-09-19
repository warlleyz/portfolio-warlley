import {
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
    },
    {
        id: 'projects',
        name: 'Projetos',
        icon: Folder,
        desktop: true,
        menu: true,
    },
    {
        id: 'technologies',
        name: 'Tecnologias',
        icon: Cpu,
        desktop: true,
        menu: true,
    },
    {
        id: 'contact',
        name: 'Contato',
        icon: Mail,
        desktop: true,
        menu: true,
    },
    {
        id: 'resume',
        name: 'Currículo',
        icon: FileText,
        desktop: true,
        menu: true,
    },
    {
        id: 'terminal',
        name: 'Terminal',
        icon: TerminalSquare,
        desktop: true,
        menu: true,
    },
    {
        id: 'stats',
        name: 'Estatísticas',
        icon: Code2,
        desktop: true,
        menu: true,
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