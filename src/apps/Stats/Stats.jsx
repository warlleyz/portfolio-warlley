import {
    useEffect,
    useMemo,
    useState,
} from 'react'

import {
    Clock,
    Code2,
    GitBranch,
} from 'lucide-react'

import {
    getGithubData,
} from '../../services/githubService'

import './Stats.css'


/* === CONFIGURAÇÕES === */
const WAKATIME_ACTIVITY_URL =
    'https://wakatime.com/share/@0e884e2e-00dc-4836-8f8c-f99c10ff79e6/0a108179-dd25-4e77-a2b8-12ca5599f8a8.json'

const WAKATIME_LANGUAGES_URL =
    'https://wakatime.com/share/@0e884e2e-00dc-4836-8f8c-f99c10ff79e6/e55209d8-c799-4af9-9b5d-d90d8486e613.json'

const WAKATIME_TIMELINE_URL =
    'https://wakatime.com/share/@0e884e2e-00dc-4836-8f8c-f99c10ff79e6/2e0cbf36-f48b-493a-828b-4df6366263d3.json'


const activityOptions = [
    {
        id:
            'annual',

        label:
            '12 meses',
    },

    {
        id:
            'weekly',

        label:
            '4 semanas',
    },

    {
        id:
            'daily',

        label:
            '7 dias',
    },
]


/* === FORMATAR SEGUNDOS === */
function formatSeconds(
    value,
) {
    const seconds =
        Number(value)

    if (
        !Number.isFinite(
            seconds,
        ) ||
        seconds < 0
    ) {
        return '--'
    }

    const hours =
        Math.floor(
            seconds / 3600,
        )

    const minutes =
        Math.floor(
            (
                seconds % 3600
            ) / 60,
        )

    if (
        hours === 0
    ) {
        return `${minutes}min`
    }

    return `${hours}h ${minutes}min`
}


/* === FORMATAR HORAS === */
function formatHours(
    value,
) {
    const hours =
        Number(value)

    if (
        !Number.isFinite(
            hours,
        ) ||
        hours < 0
    ) {
        return '--'
    }

    return formatSeconds(
        Math.round(
            hours * 3600,
        ),
    )
}


/* === EXTRAIR TIMELINE === */
function extractTimelineDays(
    timelineData,
) {
    const possibleArrays = [
        timelineData?.data,
        timelineData?.days,
        timelineData?.data?.days,
        timelineData?.data?.data,
    ]

    return (
        possibleArrays.find(
            Array.isArray,
        ) ??
        []
    )
}


/* === DATA DO DIA === */
function getDayDate(
    day,
) {
    const dateValue =
        day?.date ??
        day?.range?.date ??
        day?.range?.start ??
        day?.start

    if (
        !dateValue
    ) {
        return null
    }

    if (
        typeof dateValue ===
        'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            dateValue,
        )
    ) {
        const [
            year,
            month,
            dayNumber,
        ] =
            dateValue
                .split('-')
                .map(Number)

        const date =
            new Date(
                year,
                month - 1,
                dayNumber,
            )

        return Number.isNaN(
            date.getTime(),
        )
            ? null
            : date
    }

    const date =
        new Date(
            dateValue,
        )

    return Number.isNaN(
        date.getTime(),
    )
        ? null
        : date
}


/* === SEGUNDOS DO DIA === */
function getDaySeconds(
    day,
) {
    const directValue =
        day?.grand_total
            ?.total_seconds ??
        day?.total_seconds ??
        day?.seconds ??
        day?.duration ??
        day?.total ??
        day?.value

    if (
        directValue !==
        undefined &&
        directValue !==
        null
    ) {
        const value =
            Number(
                directValue,
            )

        return Number.isFinite(
            value,
        )
            ? Math.max(
                value,
                0,
            )
            : 0
    }

    const hours =
        Number(
            day?.grand_total
                ?.hours ??
            0,
        )

    const minutes =
        Number(
            day?.grand_total
                ?.minutes ??
            0,
        )

    const seconds =
        Number(
            day?.grand_total
                ?.seconds ??
            0,
        )

    return (
        (
            Number.isFinite(hours)
                ? hours
                : 0
        ) *
        3600 +
        (
            Number.isFinite(minutes)
                ? minutes
                : 0
        ) *
        60 +
        (
            Number.isFinite(seconds)
                ? seconds
                : 0
        )
    )
}


function getDayHours(
    day,
) {
    return (
        getDaySeconds(
            day,
        ) /
        3600
    )
}


/* === ATIVIDADE DIÁRIA === */
function getDailyActivity(
    timeline,
) {
    return timeline
        .slice(-7)
        .map(
            (
                day,
            ) => {
                const date =
                    getDayDate(
                        day,
                    )

                return {
                    label:
                        date
                            ? date
                                .toLocaleDateString(
                                    'pt-BR',
                                    {
                                        weekday:
                                            'short',
                                    },
                                )
                                .replace(
                                    '.',
                                    '',
                                )
                            : '--',

                    value:
                        getDayHours(
                            day,
                        ),
                }
            },
        )
}


/* === ATIVIDADE SEMANAL === */
function getWeeklyActivity(
    timeline,
) {
    const recentDays =
        timeline.slice(
            -28,
        )

    const weeks =
        []

    for (
        let index = 0;
        index <
        recentDays.length;
        index += 7
    ) {
        const weekDays =
            recentDays.slice(
                index,
                index + 7,
            )

        if (
            weekDays.length ===
            0
        ) {
            continue
        }

        const totalHours =
            weekDays.reduce(
                (
                    total,
                    day,
                ) =>
                    total +
                    getDayHours(
                        day,
                    ),
                0,
            )

        const startDate =
            getDayDate(
                weekDays[0],
            )

        const endDate =
            getDayDate(
                weekDays[
                weekDays.length - 1
                ],
            )

        const label =
            startDate &&
                endDate
                ? `${startDate.toLocaleDateString(
                    'pt-BR',
                    {
                        day:
                            '2-digit',

                        month:
                            '2-digit',
                    },
                )}–${endDate.toLocaleDateString(
                    'pt-BR',
                    {
                        day:
                            '2-digit',

                        month:
                            '2-digit',
                    },
                )}`
                : `Sem ${weeks.length + 1}`

        weeks.push({
            label,

            value:
                totalHours,
        })
    }

    return weeks
}


/* === ATIVIDADE ANUAL === */
function getAnnualActivity(
    timeline,
) {
    const months =
        new Map()

    timeline.forEach(
        (
            day,
        ) => {
            const date =
                getDayDate(
                    day,
                )

            if (
                !date
            ) {
                return
            }

            const key =
                `${date.getFullYear()}-${date.getMonth()}`

            const existing =
                months.get(
                    key,
                )

            if (
                existing
            ) {
                existing.value +=
                    getDayHours(
                        day,
                    )

                return
            }

            months.set(
                key,
                {
                    date,

                    value:
                        getDayHours(
                            day,
                        ),
                },
            )
        },
    )

    return Array
        .from(
            months.values(),
        )
        .sort(
            (
                first,
                second,
            ) =>
                first.date -
                second.date,
        )
        .slice(-12)
        .map(
            (
                month,
            ) => ({
                label:
                    month.date
                        .toLocaleDateString(
                            'pt-BR',
                            {
                                month:
                                    'short',
                            },
                        )
                        .replace(
                            '.',
                            '',
                        ),

                value:
                    month.value,
            }),
        )
}


/* === TÍTULO DA ATIVIDADE === */
function getActivityTitle(
    period,
) {
    switch (
    period
    ) {
        case 'daily':
            return 'Média diária'

        case 'weekly':
            return 'Média semanal'

        default:
            return 'Média mensal'
    }
}


function Stats() {
    /* === GITHUB === */
    const [
        githubData,
        setGithubData,
    ] = useState(null)

    const [
        repositories,
        setRepositories,
    ] = useState([])

    const [
        githubStatus,
        setGithubStatus,
    ] = useState('loading')


    /* === WAKATIME === */
    const [
        wakatimeActivity,
        setWakatimeActivity,
    ] = useState(null)

    const [
        wakatimeLanguages,
        setWakatimeLanguages,
    ] = useState([])

    const [
        wakatimeTimeline,
        setWakatimeTimeline,
    ] = useState([])

    const [
        wakatimeStatus,
        setWakatimeStatus,
    ] = useState('loading')

    const [
        activityPeriod,
        setActivityPeriod,
    ] = useState('annual')


    /* === CARREGAR GITHUB === */
    useEffect(() => {
        let active =
            true

        const loadGithubData =
            async () => {
                try {
                    setGithubStatus(
                        'loading',
                    )

                    const {
                        profile,
                        repositories:
                        githubRepositories,
                    } =
                        await getGithubData()

                    if (
                        !active
                    ) {
                        return
                    }

                    setGithubData(
                        profile,
                    )

                    setRepositories(
                        githubRepositories,
                    )

                    setGithubStatus(
                        'success',
                    )
                } catch (error) {
                    if (
                        !active
                    ) {
                        return
                    }

                    console.error(
                        'Erro ao carregar dados do GitHub:',
                        error,
                    )

                    setGithubStatus(
                        'error',
                    )
                }
            }

        loadGithubData()

        return () => {
            active =
                false
        }
    }, [])


    /* === CARREGAR WAKATIME === */
    useEffect(() => {
        const controller =
            new AbortController()

        const loadWakatimeData =
            async () => {
                try {
                    setWakatimeStatus(
                        'loading',
                    )

                    const [
                        activityResponse,
                        languagesResponse,
                        timelineResponse,
                    ] =
                        await Promise.all([
                            fetch(
                                WAKATIME_ACTIVITY_URL,
                                {
                                    signal:
                                        controller.signal,
                                },
                            ),

                            fetch(
                                WAKATIME_LANGUAGES_URL,
                                {
                                    signal:
                                        controller.signal,
                                },
                            ),

                            fetch(
                                WAKATIME_TIMELINE_URL,
                                {
                                    signal:
                                        controller.signal,
                                },
                            ),
                        ])

                    if (
                        !activityResponse.ok ||
                        !languagesResponse.ok ||
                        !timelineResponse.ok
                    ) {
                        throw new Error(
                            'Não foi possível carregar os dados do WakaTime.',
                        )
                    }

                    const [
                        activityData,
                        languagesData,
                        timelineData,
                    ] =
                        await Promise.all([
                            activityResponse.json(),
                            languagesResponse.json(),
                            timelineResponse.json(),
                        ])

                    setWakatimeActivity(
                        activityData?.data ??
                        null,
                    )

                    setWakatimeLanguages(
                        Array.isArray(
                            languagesData?.data,
                        )
                            ? languagesData.data
                            : [],
                    )

                    setWakatimeTimeline(
                        extractTimelineDays(
                            timelineData,
                        ),
                    )

                    setWakatimeStatus(
                        'success',
                    )
                } catch (error) {
                    if (
                        error.name ===
                        'AbortError'
                    ) {
                        return
                    }

                    setWakatimeStatus(
                        'error',
                    )
                }
            }

        loadWakatimeData()

        return () => {
            controller.abort()
        }
    }, [])


    /* === GITHUB: LINGUAGEM PRINCIPAL === */
    const mainGithubLanguage =
        useMemo(
            () => {
                const languages =
                    new Map()

                repositories.forEach(
                    (
                        repository,
                    ) => {
                        if (
                            !repository.language
                        ) {
                            return
                        }

                        languages.set(
                            repository.language,
                            (
                                languages.get(
                                    repository.language,
                                ) ??
                                0
                            ) +
                            1,
                        )
                    },
                )

                const sortedLanguages =
                    Array
                        .from(
                            languages.entries(),
                        )
                        .sort(
                            (
                                first,
                                second,
                            ) =>
                                second[1] -
                                first[1],
                        )

                return (
                    sortedLanguages[0]?.[0] ??
                    '--'
                )
            },
            [
                repositories,
            ],
        )


    /* === GITHUB: ESTRELAS === */
    const totalStars =
        useMemo(
            () =>
                repositories.reduce(
                    (
                        total,
                        repository,
                    ) =>
                        total +
                        (
                            Number(
                                repository.stars,
                            ) ||
                            0
                        ),
                    0,
                ),
            [
                repositories,
            ],
        )


    /* === GITHUB: ANO === */
    const accountYear =
        useMemo(
            () => {
                if (
                    !githubData?.createdAt
                ) {
                    return '--'
                }

                const date =
                    new Date(
                        githubData.createdAt,
                    )

                return Number.isNaN(
                    date.getTime(),
                )
                    ? '--'
                    : date.getFullYear()
            },
            [
                githubData,
            ],
        )


    /* === WAKATIME: TOTAL === */
    const wakatimeTotal =
        useMemo(
            () => {
                const grandTotal =
                    wakatimeActivity
                        ?.grand_total

                if (
                    !grandTotal
                ) {
                    return '--'
                }

                if (
                    grandTotal.text
                ) {
                    return grandTotal.text
                }

                if (
                    grandTotal.digital
                ) {
                    return grandTotal.digital
                }

                const totalSeconds =
                    grandTotal
                        .total_seconds ??
                    grandTotal
                        .seconds

                return totalSeconds
                    ? formatSeconds(
                        totalSeconds,
                    )
                    : '--'
            },
            [
                wakatimeActivity,
            ],
        )


    /* === WAKATIME: LINGUAGEM PRINCIPAL === */
    const wakatimeMainLanguage =
        wakatimeLanguages[0]
            ?.name ??
        '--'


    /* === DADOS DA ATIVIDADE === */
    const activityData =
        useMemo(
            () => {
                if (
                    !Array.isArray(
                        wakatimeTimeline,
                    ) ||
                    wakatimeTimeline.length ===
                    0
                ) {
                    return []
                }

                if (
                    activityPeriod ===
                    'daily'
                ) {
                    return getDailyActivity(
                        wakatimeTimeline,
                    )
                }

                if (
                    activityPeriod ===
                    'weekly'
                ) {
                    return getWeeklyActivity(
                        wakatimeTimeline,
                    )
                }

                return getAnnualActivity(
                    wakatimeTimeline,
                )
            },
            [
                activityPeriod,
                wakatimeTimeline,
            ],
        )


    /* === RESUMO DA ATIVIDADE === */
    const activityMax =
        Math.max(
            ...activityData.map(
                (
                    item,
                ) =>
                    Number.isFinite(
                        item.value,
                    )
                        ? item.value
                        : 0,
            ),
            1,
        )

    const activityTotal =
        activityData.reduce(
            (
                total,
                item,
            ) =>
                total +
                (
                    Number.isFinite(
                        item.value,
                    )
                        ? item.value
                        : 0
                ),
            0,
        )

    const activityAverage =
        activityData.length > 0
            ? activityTotal /
            activityData.length
            : 0


    /* === RENDERIZAÇÃO === */
    return (
        <div className="stats">

            {/* === CABEÇALHO === */}
            <header className="stats-header">
                <div className="stats-header-content">
                    <span className="stats-label">
                        Estatísticas
                    </span>

                    <h1>
                        Minha atividade de desenvolvimento
                    </h1>

                    <p>
                        Dados de programação e atividade
                        dos meus projetos.
                    </p>
                </div>

                <div
                    className="stats-status"
                    aria-live="polite"
                >
                    <span
                        className={
                            `stats-status-item stats-status-${githubStatus}`
                        }
                    >
                        <GitBranch
                            size={12}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        GitHub
                    </span>

                    <span
                        className={
                            `stats-status-item stats-status-${wakatimeStatus}`
                        }
                    >
                        <Code2
                            size={12}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        WakaTime
                    </span>
                </div>
            </header>


            {/* === RESUMO === */}
            <section className="stats-summary">
                <article className="stats-card">
                    <span className="stats-card-icon">
                        <Clock
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="stats-card-content">
                        <span>
                            Tempo total
                        </span>

                        <strong>
                            {
                                wakatimeStatus ===
                                    'success'
                                    ? wakatimeTotal
                                    : '--'
                            }
                        </strong>

                        <small>
                            WakaTime
                        </small>
                    </div>
                </article>

                <article className="stats-card">
                    <span className="stats-card-icon">
                        <Code2
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="stats-card-content">
                        <span>
                            Linguagem principal
                        </span>

                        <strong>
                            {
                                wakatimeStatus ===
                                    'success'
                                    ? wakatimeMainLanguage
                                    : '--'
                            }
                        </strong>

                        <small>
                            WakaTime
                        </small>
                    </div>
                </article>

                <article className="stats-card">
                    <span className="stats-card-icon">
                        <GitBranch
                            size={19}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="stats-card-content">
                        <span>
                            Repositórios públicos
                        </span>

                        <strong>
                            {
                                githubStatus ===
                                    'success'
                                    ? githubData
                                        ?.publicRepos ??
                                    0
                                    : '--'
                            }
                        </strong>

                        <small>
                            GitHub
                        </small>
                    </div>
                </article>
            </section>


            {/* === WAKATIME === */}
            <section className="stats-section">
                <div className="stats-section-header">
                    <div className="stats-section-heading">
                        <span className="stats-section-icon">
                            <Code2
                                size={16}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </span>

                        <div>
                            <h2>
                                WakaTime
                            </h2>

                            <p>
                                Atividade de programação
                            </p>
                        </div>
                    </div>

                    <span className="stats-source">
                        All Time
                    </span>
                </div>


                {wakatimeStatus ===
                    'loading' && (
                        <div className="stats-placeholder">
                            Carregando dados do WakaTime...
                        </div>
                    )}


                {wakatimeStatus ===
                    'error' && (
                        <div className="stats-placeholder">
                            Não foi possível carregar
                            os dados do WakaTime.
                        </div>
                    )}


                {wakatimeStatus ===
                    'success' && (
                        <>
                            {/* === LINGUAGENS === */}
                            <div className="wakatime-languages">
                                {wakatimeLanguages
                                    .slice(
                                        0,
                                        5,
                                    )
                                    .map(
                                        (
                                            language,
                                        ) => {
                                            const percentage =
                                                Math.min(
                                                    Math.max(
                                                        Number(
                                                            language.percent,
                                                        ) ||
                                                        0,
                                                        0,
                                                    ),
                                                    100,
                                                )

                                            return (
                                                <div
                                                    className="wakatime-language"
                                                    key={
                                                        language.name
                                                    }
                                                >
                                                    <div className="wakatime-language-header">
                                                        <span>
                                                            {
                                                                language.name
                                                            }
                                                        </span>

                                                        <strong>
                                                            {
                                                                percentage.toFixed(
                                                                    1,
                                                                )
                                                            }
                                                            %
                                                        </strong>
                                                    </div>

                                                    <div
                                                        className="wakatime-language-bar"
                                                        role="progressbar"
                                                        aria-label={
                                                            `${language.name}: ${percentage.toFixed(1)}%`
                                                        }
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                        aria-valuenow={
                                                            percentage
                                                        }
                                                    >
                                                        <span
                                                            className="wakatime-language-progress"
                                                            style={{
                                                                width:
                                                                    `${percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        },
                                    )}
                            </div>


                            {/* === ATIVIDADE === */}
                            <div className="wakatime-activity">
                                <div className="wakatime-activity-header">
                                    <div className="wakatime-activity-info">
                                        <span>
                                            Atividade
                                        </span>

                                        <h3>
                                            {
                                                getActivityTitle(
                                                    activityPeriod,
                                                )
                                            }
                                        </h3>

                                        <strong>
                                            {
                                                activityData.length >
                                                    0
                                                    ? formatHours(
                                                        activityAverage,
                                                    )
                                                    : '--'
                                            }
                                        </strong>
                                    </div>

                                    <div
                                        className="wakatime-period-selector"
                                        aria-label="Período da atividade"
                                    >
                                        {activityOptions.map(
                                            (
                                                option,
                                            ) => {
                                                const isActive =
                                                    activityPeriod ===
                                                    option.id

                                                return (
                                                    <button
                                                        key={
                                                            option.id
                                                        }
                                                        type="button"
                                                        className={[
                                                            'wakatime-period-button',

                                                            isActive
                                                                ? 'active'
                                                                : '',
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' ')}
                                                        onClick={() =>
                                                            setActivityPeriod(
                                                                option.id,
                                                            )
                                                        }
                                                        aria-pressed={
                                                            isActive
                                                        }
                                                    >
                                                        {
                                                            option.label
                                                        }
                                                    </button>
                                                )
                                            },
                                        )}
                                    </div>
                                </div>


                                {activityData.length >
                                    0 ? (
                                    <div
                                        className="wakatime-chart"
                                        aria-label="Gráfico de atividade do WakaTime"
                                    >
                                        {activityData.map(
                                            (
                                                item,
                                                index,
                                            ) => {
                                                const value =
                                                    Number.isFinite(
                                                        item.value,
                                                    )
                                                        ? Math.max(
                                                            item.value,
                                                            0,
                                                        )
                                                        : 0

                                                const height =
                                                    Math.max(
                                                        (
                                                            value /
                                                            activityMax
                                                        ) *
                                                        100,
                                                        3,
                                                    )

                                                return (
                                                    <div
                                                        className="wakatime-chart-item"
                                                        key={
                                                            `${item.label}-${index}`
                                                        }
                                                    >
                                                        <div
                                                            className="wakatime-chart-column"
                                                            aria-label={
                                                                `${item.label}: ${formatHours(value)}`
                                                            }
                                                        >
                                                            <span
                                                                className="wakatime-chart-tooltip"
                                                                aria-hidden="true"
                                                            >
                                                                {
                                                                    formatHours(
                                                                        value,
                                                                    )
                                                                }
                                                            </span>

                                                            <span
                                                                className="wakatime-chart-bar"
                                                                style={{
                                                                    height:
                                                                        `${height}%`,
                                                                }}
                                                                aria-hidden="true"
                                                            />
                                                        </div>

                                                        <span className="wakatime-chart-label">
                                                            {
                                                                item.label
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <div className="stats-placeholder">
                                        Nenhum dado disponível.
                                    </div>
                                )}
                            </div>
                        </>
                    )}
            </section>


            {/* === GITHUB === */}
            <section className="stats-section">
                <div className="stats-section-header">
                    <div className="stats-section-heading">
                        <span className="stats-section-icon">
                            <GitBranch
                                size={16}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </span>

                        <div>
                            <h2>
                                GitHub
                            </h2>

                            <p>
                                github.com/warlleyz
                            </p>
                        </div>
                    </div>

                    <span className="stats-source">
                        Perfil público
                    </span>
                </div>


                {githubStatus ===
                    'loading' && (
                        <div className="stats-placeholder">
                            Carregando dados do GitHub...
                        </div>
                    )}


                {githubStatus ===
                    'error' && (
                        <div className="stats-placeholder">
                            Não foi possível carregar
                            os dados do GitHub.
                        </div>
                    )}


                {githubStatus ===
                    'success' && (
                        <div className="github-stats-grid">
                            <div className="github-stat">
                                <span>
                                    Repositórios
                                </span>

                                <strong>
                                    {
                                        githubData
                                            ?.publicRepos ??
                                        0
                                    }
                                </strong>
                            </div>

                            <div className="github-stat">
                                <span>
                                    Linguagem principal
                                </span>

                                <strong>
                                    {
                                        mainGithubLanguage
                                    }
                                </strong>
                            </div>

                            <div className="github-stat">
                                <span>
                                    Seguidores
                                </span>

                                <strong>
                                    {
                                        githubData
                                            ?.followers ??
                                        0
                                    }
                                </strong>
                            </div>

                            <div className="github-stat">
                                <span>
                                    Seguindo
                                </span>

                                <strong>
                                    {
                                        githubData
                                            ?.following ??
                                        0
                                    }
                                </strong>
                            </div>

                            <div className="github-stat">
                                <span>
                                    Estrelas
                                </span>

                                <strong>
                                    {
                                        totalStars
                                    }
                                </strong>
                            </div>

                            <div className="github-stat">
                                <span>
                                    GitHub desde
                                </span>

                                <strong>
                                    {
                                        accountYear
                                    }
                                </strong>
                            </div>
                        </div>
                    )}
            </section>
        </div>
    )
}


export default Stats