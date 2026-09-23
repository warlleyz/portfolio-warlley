import {
    ArrowLeft,
    Award,
    CalendarDays,
    Clock3,
    Download,
    ExternalLink,
    FileText,
    Search,
} from 'lucide-react'

import {
    useMemo,
    useState,
} from 'react'

import {
    certificateCategories,
} from '../../data/certificatesData'

import certificatesData from '../../data/certificatesData'

import './Certificates.css'


/* === FORMATAR DATA === */
const formatCertificateDate = (
    value,
) => {
    if (
        !value
    ) {
        return ''
    }

    const date =
        new Date(
            `${value}T12:00:00`,
        )

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return value
    }

    return date
        .toLocaleDateString(
            'pt-BR',
            {
                month:
                    'long',

                year:
                    'numeric',
            },
        )
}


/* === ANO === */
const getCertificateYear = (
    value,
) => {
    if (
        !value
    ) {
        return ''
    }

    return String(
        value,
    ).slice(
        0,
        4,
    )
}


/* === NORMALIZAR TEXTO === */
const normalizeText = (
    value = '',
) => {
    return String(
        value,
    )
        .normalize(
            'NFD',
        )
        .replace(
            /[\u0300-\u036f]/g,
            '',
        )
        .toLocaleLowerCase(
            'pt-BR',
        )
        .trim()
}


/* === TEXTO PESQUISÁVEL === */
const getCertificateSearchText = (
    certificate,
) => {
    return normalizeText(
        [
            certificate.title,
            certificate.issuer,
            certificate.category,
            certificate.description,
            certificate.workload,
            ...(certificate.tags ?? []),
        ].join(
            ' ',
        ),
    )
}


/* === CATEGORIA === */
const getCategoryLabel = (
    categoryId,
) => {
    return (
        certificateCategories.find(
            (
                category,
            ) =>
                category.id ===
                categoryId,
        )?.label ??
        'Certificado'
    )
}


/* === CARD === */
function CertificateCard({
    certificate,
    onOpen,
}) {
    return (
        <button
            className="certificate-card"
            type="button"
            onClick={() =>
                onOpen(
                    certificate,
                )
            }
            aria-label={
                `Abrir certificado ${certificate.title}`
            }
        >
            <div className="certificate-card-top">
                <span className="certificate-card-icon">
                    <Award
                        size={20}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                </span>

                <span className="certificate-card-category">
                    {
                        getCategoryLabel(
                            certificate.category,
                        )
                    }
                </span>
            </div>

            <div className="certificate-card-content">
                <div>
                    <h3>
                        {
                            certificate.title
                        }
                    </h3>

                    <span className="certificate-card-issuer">
                        {
                            certificate.issuer
                        }
                    </span>
                </div>

                <div className="certificate-card-meta">
                    <span>
                        <CalendarDays
                            size={14}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />

                        {
                            formatCertificateDate(
                                certificate.date,
                            )
                        }
                    </span>

                    {
                        certificate.workload &&
                        (
                            <span>
                                <Clock3
                                    size={14}
                                    strokeWidth={1.7}
                                    aria-hidden="true"
                                />

                                {
                                    certificate.workload
                                }
                            </span>
                        )
                    }
                </div>

                {
                    certificate.tags?.length >
                    0 &&
                    (
                        <div className="certificate-card-tags">
                            {
                                certificate.tags.map(
                                    (
                                        tag,
                                    ) => (
                                        <span
                                            key={
                                                tag
                                            }
                                        >
                                            {
                                                tag
                                            }
                                        </span>
                                    ),
                                )
                            }
                        </div>
                    )
                }
            </div>

            <span className="certificate-card-action">
                Ver certificado

                <ExternalLink
                    size={14}
                    strokeWidth={1.7}
                    aria-hidden="true"
                />
            </span>
        </button>
    )
}


/* === DETALHES === */
function CertificateDetails({
    certificate,
    onBack,
}) {
    return (
        <div className="certificate-details">

            {/* === CABEÇALHO === */}
            <header className="certificate-details-header">
                <button
                    className="certificate-back-button"
                    type="button"
                    onClick={
                        onBack
                    }
                >
                    <ArrowLeft
                        size={16}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    Voltar
                </button>
            </header>


            {/* === INFORMAÇÕES === */}
            <section className="certificate-details-info">
                <div className="certificate-details-icon">
                    <Award
                        size={26}
                        strokeWidth={1.6}
                        aria-hidden="true"
                    />
                </div>

                <div className="certificate-details-heading">
                    <span className="certificate-details-category">
                        {
                            getCategoryLabel(
                                certificate.category,
                            )
                        }
                    </span>

                    <h2>
                        {
                            certificate.title
                        }
                    </h2>

                    <strong>
                        {
                            certificate.issuer
                        }
                    </strong>
                </div>
            </section>


            {/* === METADADOS === */}
            <section className="certificate-details-meta">
                <div>
                    <span>
                        Data
                    </span>

                    <strong>
                        {
                            formatCertificateDate(
                                certificate.date,
                            )
                        }
                    </strong>
                </div>

                {
                    certificate.workload &&
                    (
                        <div>
                            <span>
                                Carga horária
                            </span>

                            <strong>
                                {
                                    certificate.workload
                                }
                            </strong>
                        </div>
                    )
                }
            </section>


            {/* === DESCRIÇÃO === */}
            {
                certificate.description &&
                (
                    <section className="certificate-details-description">
                        <h3>
                            Sobre
                        </h3>

                        <p>
                            {
                                certificate.description
                            }
                        </p>
                    </section>
                )
            }


            {/* === TAGS === */}
            {
                certificate.tags?.length >
                0 &&
                (
                    <section className="certificate-details-tags">
                        {
                            certificate.tags.map(
                                (
                                    tag,
                                ) => (
                                    <span
                                        key={
                                            tag
                                        }
                                    >
                                        {
                                            tag
                                        }
                                    </span>
                                ),
                            )
                        }
                    </section>
                )
            }


            {/* === DOCUMENTO === */}
            <section className="certificate-document">
                <div className="certificate-document-preview">
                    {
                        certificate.file
                            ? (
                                <iframe
                                    src={
                                        certificate.file
                                    }
                                    title={
                                        `Certificado ${certificate.title}`
                                    }
                                />
                            )
                            : (
                                <div className="certificate-document-empty">
                                    <FileText
                                        size={34}
                                        strokeWidth={1.5}
                                        aria-hidden="true"
                                    />

                                    <strong>
                                        Documento ainda não adicionado
                                    </strong>

                                    <span>
                                        O certificado será disponibilizado aqui.
                                    </span>
                                </div>
                            )
                    }
                </div>

                <div className="certificate-document-actions">
                    {
                        certificate.file &&
                        (
                            <>
                                <a
                                    href={
                                        certificate.file
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink
                                        size={15}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />

                                    Abrir documento
                                </a>

                                <a
                                    href={
                                        certificate.file
                                    }
                                    download
                                >
                                    <Download
                                        size={15}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />

                                    Baixar
                                </a>
                            </>
                        )
                    }

                    {
                        certificate.credentialUrl &&
                        (
                            <a
                                href={
                                    certificate.credentialUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Award
                                    size={15}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />

                                Verificar credencial
                            </a>
                        )
                    }
                </div>
            </section>
        </div>
    )
}


/* === APP === */
function Certificates() {

    /* === ESTADO === */
    const [
        search,
        setSearch,
    ] = useState('')

    const [
        activeCategory,
        setActiveCategory,
    ] = useState(
        'all',
    )

    const [
        selectedCertificate,
        setSelectedCertificate,
    ] = useState(
        null,
    )


    /* === CERTIFICADOS FILTRADOS === */
    const filteredCertificates =
        useMemo(
            () => {
                const normalizedSearch =
                    normalizeText(
                        search,
                    )

                return [
                    ...certificatesData,
                ]
                    .filter(
                        (
                            certificate,
                        ) => {
                            if (
                                activeCategory ===
                                'all'
                            ) {
                                return true
                            }

                            return (
                                certificate.category ===
                                activeCategory
                            )
                        },
                    )
                    .filter(
                        (
                            certificate,
                        ) => {
                            if (
                                !normalizedSearch
                            ) {
                                return true
                            }

                            return (
                                getCertificateSearchText(
                                    certificate,
                                )
                                    .includes(
                                        normalizedSearch,
                                    )
                            )
                        },
                    )
                    .sort(
                        (
                            first,
                            second,
                        ) =>
                            new Date(
                                second.date,
                            ) -
                            new Date(
                                first.date,
                            ),
                    )
            },
            [
                activeCategory,
                search,
            ],
        )


    /* === AGRUPAR POR ANO === */
    const groupedCertificates =
        useMemo(
            () => {
                return filteredCertificates
                    .reduce(
                        (
                            groups,
                            certificate,
                        ) => {
                            const year =
                                getCertificateYear(
                                    certificate.date,
                                )

                            if (
                                !groups[
                                year
                                ]
                            ) {
                                groups[
                                    year
                                ] = []
                            }

                            groups[
                                year
                            ].push(
                                certificate,
                            )

                            return groups
                        },
                        {},
                    )
            },
            [
                filteredCertificates,
            ],
        )


    /* === DETALHES === */
    if (
        selectedCertificate
    ) {
        return (
            <div className="certificates">
                <CertificateDetails
                    certificate={
                        selectedCertificate
                    }
                    onBack={() =>
                        setSelectedCertificate(
                            null,
                        )
                    }
                />
            </div>
        )
    }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="certificates">

            {/* === APRESENTAÇÃO === */}
            <header className="certificates-header">
                <div className="certificates-heading">
                    <span className="certificates-heading-icon">
                        <Award
                            size={22}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <h2>
                            Certificados
                        </h2>

                        <p>
                            Cursos, certificações e participações
                            que fazem parte da minha formação.
                        </p>
                    </div>
                </div>
            </header>


            {/* === FILTROS === */}
            <section className="certificates-toolbar">
                <div className="certificates-categories">
                    {
                        certificateCategories.map(
                            (
                                category,
                            ) => (
                                <button
                                    key={
                                        category.id
                                    }
                                    className={
                                        activeCategory ===
                                            category.id
                                            ? 'active'
                                            : ''
                                    }
                                    type="button"
                                    onClick={() =>
                                        setActiveCategory(
                                            category.id,
                                        )
                                    }
                                >
                                    {
                                        category.label
                                    }
                                </button>
                            ),
                        )
                    }
                </div>

                <label className="certificates-search">
                    <Search
                        size={16}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <input
                        type="search"
                        value={
                            search
                        }
                        onChange={(
                            event,
                        ) =>
                            setSearch(
                                event.target.value,
                            )
                        }
                        placeholder="Pesquisar certificados..."
                        aria-label="Pesquisar certificados"
                        autoComplete="off"
                    />
                </label>
            </section>


            {/* === CONTEÚDO === */}
            <div className="certificates-content">
                {
                    filteredCertificates.length ===
                        0
                        ? (
                            <div className="certificates-empty">
                                <Award
                                    size={34}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />

                                <strong>
                                    Nenhum certificado encontrado
                                </strong>

                                <span>
                                    Os certificados serão adicionados
                                    gradualmente ao portfólio.
                                </span>
                            </div>
                        )
                        : (
                            Object.entries(
                                groupedCertificates,
                            )
                                .sort(
                                    (
                                        [
                                            firstYear,
                                        ],

                                        [
                                            secondYear,
                                        ],
                                    ) =>
                                        Number(
                                            secondYear,
                                        ) -
                                        Number(
                                            firstYear,
                                        ),
                                )
                                .map(
                                    ([
                                        year,
                                        certificates,
                                    ]) => (
                                        <section
                                            className="certificates-year"
                                            key={
                                                year
                                            }
                                        >
                                            <div className="certificates-year-heading">
                                                <span>
                                                    {
                                                        year
                                                    }
                                                </span>

                                                <div />
                                            </div>

                                            <div className="certificates-grid">
                                                {
                                                    certificates.map(
                                                        (
                                                            certificate,
                                                        ) => (
                                                            <CertificateCard
                                                                key={
                                                                    certificate.id
                                                                }
                                                                certificate={
                                                                    certificate
                                                                }
                                                                onOpen={
                                                                    setSelectedCertificate
                                                                }
                                                            />
                                                        ),
                                                    )
                                                }
                                            </div>
                                        </section>
                                    ),
                                )
                        )
                }
            </div>
        </div>
    )
}


export default Certificates