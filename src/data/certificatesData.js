const BASE_URL =
    import.meta.env.BASE_URL


/* === CATEGORIAS === */
const certificateCategories = [
    {
        id:
            'all',

        label:
            'Todos',
    },

    {
        id:
            'course',

        label:
            'Cursos',
    },

    {
        id:
            'event',

        label:
            'Eventos',
    },

    {
        id:
            'certification',

        label:
            'Certificações',
    },

    {
        id:
            'participation',

        label:
            'Participações',
    },
]


/* === CAMINHO BASE === */
const certificatesBaseUrl =
    `${BASE_URL}certificates/`


/* === CERTIFICADOS === */
const certificatesData = [
    {
        id:
            'power-bi-gestao-enap',

        title:
            'Aplicação do Power BI para Aprimoramento da Gestão',

        issuer:
            'Escola Nacional de Administração Pública - ENAP',

        category:
            'course',

        date:
            '2026-09-21',

        workload:
            '25 horas',

        description:
            'Curso voltado à aplicação do Power BI na gestão, abordando obtenção e transformação de dados, modelagem, cálculos, visualização, publicação e automatização no Power BI Online.',

        tags: [
            'Power BI',
            'Dados',
            'Modelagem',
            'Visualização',
            'Gestão',
        ],

        file:
            `${certificatesBaseUrl}courses/power-bi-gestao.pdf`,

        credentialUrl:
            'https://www.escolavirtual.gov.br/documentos/validacao',
    },

    {
        id:
            'github-copilot-dev-days',

        title:
            'GitHub Copilot Dev Days na PUC Minas',

        issuer:
            'PUC Minas - ICEI',

        category:
            'event',

        date:
            '2026-05-12',

        workload:
            '2 horas',

        description:
            'Participação no evento GitHub Copilot Dev Days realizado na PUC Minas, com foco em desenvolvimento de software e uso de inteligência artificial aplicada à programação.',

        tags: [
            'GitHub',
            'GitHub Copilot',
            'IA',
            'Desenvolvimento',
        ],

        file:
            `${certificatesBaseUrl}events/github-copilot-dev-days.pdf`,

        credentialUrl:
            null,
    },

    {
        id:
            'we-make-software-coreu-2026-01',

        title:
            'We Make Software - COREU - 1º semestre de 2026',

        issuer:
            'PUC Minas - Engenharia de Software',

        category:
            'event',

        date:
            '2026-03-16',

        workload:
            '4 horas',

        description:
            'Participação no evento We Make Software - COREU, realizado pela área de Engenharia de Software da PUC Minas.',

        tags: [
            'Engenharia de Software',
            'Desenvolvimento',
            'PUC Minas',
        ],

        file:
            `${certificatesBaseUrl}events/we-make-software-coreu-2026-01.pdf`,

        credentialUrl:
            'https://www.even3.com.br/documentos',
    },
]


export {
    certificateCategories,
    certificatesBaseUrl,
}

export default certificatesData