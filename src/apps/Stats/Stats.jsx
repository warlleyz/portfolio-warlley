import {
    useEffect,
    useState,
} from 'react'

import {
    Clock,
    Code2,
    GitBranch,
} from 'lucide-react'

import './Stats.css'


/* === CONFIGURAÇÕES === */

const githubUsername =
    'warlleyz'

const wakatimeActivityUrl =
    'https://wakatime.com/share/@0e884e2e-00dc-4836-8f8c-f99c10ff79e6/0a108179-dd25-4e77-a2b8-12ca5599f8a8.json'

const wakatimeLanguagesUrl =
    'https://wakatime.com/share/@0e884e2e-00dc-4836-8f8c-f99c10ff79e6/e55209d8-c799-4af9-9b5d-d90d8486e613.json'

const wakatimeTimelineUrl =
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
    seconds,
) {
    const hours =
        Math.floor(
            seconds /
            3600,
        )

    const minutes =
        Math.floor(
            (
                seconds %
                3600
            ) /
            60,
        )


    if (
        hours ===
        0
    ) {
        return `${minutes}min`
    }


    return `${hours}h ${minutes}min`
}


/* === FORMATAR HORAS === */

function formatHours(
    hours,
) {
    return formatSeconds(
        Math.round(
            hours *
            3600,
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


    const foundArray =
        possibleArrays.find(
            (
                value,
            ) =>
                Array.isArray(
                    value,
                ),
        )


    return foundArray ?? []
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


                    const [
                        userResponse,
                        reposResponse,
                    ] =
                        await Promise.all([
                            fetch(
                                `https://api.github.com/users/${githubUsername}`,
                            ),

                            fetch(
                                `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`,
                            ),
                        ])


                    if (
                        !userResponse.ok ||
                        !reposResponse.ok
                    ) {
                        throw new Error(
                            'Erro ao carregar GitHub',
                        )
                    }


                    const userData =
                        await userResponse.json()

                    const reposData =
                        await reposResponse.json()


                    if (
                        !active
                    ) {
                        return
                    }


                    setGithubData(
                        userData,
                    )

                    setRepositories(
                        reposData,
                    )

                    setGithubStatus(
                        'success',
                    )
                } catch (
                error
                ) {
                    console.error(
                        'Erro GitHub:',
                        error,
                    )


                    if (
                        active
                    ) {
                        setGithubStatus(
                            'error',
                        )
                    }
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
        let active =
            true


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
                                wakatimeActivityUrl,
                            ),

                            fetch(
                                wakatimeLanguagesUrl,
                            ),

                            fetch(
                                wakatimeTimelineUrl,
                            ),
                        ])


                    if (
                        !activityResponse.ok ||
                        !languagesResponse.ok ||
                        !timelineResponse.ok
                    ) {
                        throw new Error(
                            'Erro ao carregar WakaTime',
                        )
                    }


                    const activityData =
                        await activityResponse.json()

                    const languagesData =
                        await languagesResponse.json()

                    const timelineData =
                        await timelineResponse.json()


                    if (
                        !active
                    ) {
                        return
                    }


                    setWakatimeActivity(
                        activityData.data ??
                        null,
                    )

                    setWakatimeLanguages(
                        Array.isArray(
                            languagesData.data,
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
                } catch (
                error
                ) {
                    console.error(
                        'Erro WakaTime:',
                        error,
                    )


                    if (
                        active
                    ) {
                        setWakatimeStatus(
                            'error',
                        )
                    }
                }
            }


        loadWakatimeData()


        return () => {
            active =
                false
        }
    }, [])


    /* === GITHUB: LINGUAGEM PRINCIPAL === */

    const getMainLanguage =
        () => {
            const languages =
                {}


            repositories.forEach(
                (
                    repository,
                ) => {
                    if (
                        !repository.language
                    ) {
                        return
                    }


                    languages[
                        repository.language
                    ] =
                        (
                            languages[
                            repository.language
                            ] ??
                            0
                        ) +
                        1
                },
            )


            const sortedLanguages =
                Object
                    .entries(
                        languages,
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
                sortedLanguages[0]
                ?.[0] ??
                '--'
            )
        }


    /* === GITHUB: ESTRELAS === */

    const getTotalStars =
        () =>
            repositories.reduce(
                (
                    total,
                    repository,
                ) =>
                    total +
                    (
                        repository
                            .stargazers_count ??
                        0
                    ),
                0,
            )


    /* === GITHUB: ANO === */

    const getAccountYear =
        () => {
            if (
                !githubData
                    ?.created_at
            ) {
                return '--'
            }


            return new Date(
                githubData
                    .created_at,
            ).getFullYear()
        }


    /* === WAKATIME: TOTAL === */

    const getWakatimeTotal =
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


            if (
                !totalSeconds
            ) {
                return '--'
            }


            return formatSeconds(
                totalSeconds,
            )
        }


    /* === WAKATIME: LINGUAGEM === */

    const getWakatimeMainLanguage =
        () =>
            wakatimeLanguages[0]
                ?.name ??
            '--'


    /* === DATA DO DIA === */

    const getDayDate =
        (
            day,
        ) => {
            const dateValue =
                day.date ??
                day.range?.date ??
                day.range?.start ??
                day.start


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
                        .split(
                            '-',
                        )
                        .map(
                            Number,
                        )


                return new Date(
                    year,
                    month -
                    1,
                    dayNumber,
                )
            }


            const date =
                new Date(
                    dateValue,
                )


            if (
                Number.isNaN(
                    date.getTime(),
                )
            ) {
                return null
            }


            return date
        }


    /* === SEGUNDOS DO DIA === */

    const getDaySeconds =
        (
            day,
        ) => {
            const directValue =
                day.grand_total
                    ?.total_seconds ??
                day.total_seconds ??
                day.seconds ??
                day.duration ??
                day.total ??
                day.value


            if (
                directValue !==
                undefined &&
                directValue !==
                null
            ) {
                return (
                    Number(
                        directValue,
                    ) ||
                    0
                )
            }


            const hours =
                Number(
                    day.grand_total
                        ?.hours ??
                    0,
                )

            const minutes =
                Number(
                    day.grand_total
                        ?.minutes ??
                    0,
                )

            const seconds =
                Number(
                    day.grand_total
                        ?.seconds ??
                    0,
                )


            return (
                hours *
                3600 +
                minutes *
                60 +
                seconds
            )
        }


    const getDayHours =
        (
            day,
        ) =>
            getDaySeconds(
                day,
            ) /
            3600


    /* === ATIVIDADE DIÁRIA === */

    const getDailyActivity =
        () =>
            wakatimeTimeline
                .slice(
                    -7,
                )
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


    /* === ATIVIDADE SEMANAL === */

    const getWeeklyActivity =
        () => {
            const recentDays =
                wakatimeTimeline.slice(
                    -28,
                )

            const weeks =
                []


            for (
                let index =
                    0;
                index <
                recentDays.length;
                index +=
                7
            ) {
                const weekDays =
                    recentDays.slice(
                        index,
                        index +
                        7,
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
                        weekDays.length -
                        1
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

    const getAnnualActivity =
        () => {
            const months =
                new Map()


            wakatimeTimeline.forEach(
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
                .slice(
                    -12,
                )
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


    /* === DADOS DA ATIVIDADE === */

    const getActivityData =
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
                return getDailyActivity()
            }


            if (
                activityPeriod ===
                'weekly'
            ) {
                return getWeeklyActivity()
            }


            return getAnnualActivity()
        }


    const getActivityTitle =
        () => {
            switch (
            activityPeriod
            ) {
                case 'daily':
                    return 'Média diária'

                case 'weekly':
                    return 'Média semanal'

                default:
                    return 'Média mensal'
            }
        }


    const activityData =
        getActivityData()


    const activityMax =
        Math.max(
            ...activityData.map(
                (
                    item,
                ) =>
                    item.value,
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
                item.value,
            0,
        )


    const activityAverage =
        activityData.length >
            0
            ? activityTotal /
            activityData.length
            : 0


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


                <div className="stats-status">
                    <span
                        className={`stats-status-item stats-status-${githubStatus}`}
                    >
                        <GitBranch
                            size={12}
                            strokeWidth={1.8}
                        />

                        GitHub
                    </span>

                    <span
                        className={`stats-status-item stats-status-${wakatimeStatus}`}
                    >
                        <Code2
                            size={12}
                            strokeWidth={1.8}
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
                        />
                    </span>

                    <div className="stats-card-content">
                        <span>
                            Tempo total
                        </span>

                        <strong>
                            {wakatimeStatus ===
                                'success'
                                ? getWakatimeTotal()
                                : '--'}
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
                        />
                    </span>

                    <div className="stats-card-content">
                        <span>
                            Linguagem principal
                        </span>

                        <strong>
                            {wakatimeStatus ===
                                'success'
                                ? getWakatimeMainLanguage()
                                : '--'}
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
                        />
                    </span>

                    <div className="stats-card-content">
                        <span>
                            Repositórios públicos
                        </span>

                        <strong>
                            {githubStatus ===
                                'success'
                                ? githubData
                                    ?.public_repos
                                : '--'}
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
                                        ) => (
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
                                                        {Number(
                                                            language.percent,
                                                        ).toFixed(
                                                            1,
                                                        )}
                                                        %
                                                    </strong>
                                                </div>

                                                <div className="wakatime-language-bar">
                                                    <span
                                                        className="wakatime-language-progress"
                                                        style={{
                                                            width:
                                                                `${language.percent}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ),
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
                                                getActivityTitle()
                                            }
                                        </h3>

                                        <strong>
                                            {activityData.length >
                                                0
                                                ? formatHours(
                                                    activityAverage,
                                                )
                                                : '--'}
                                        </strong>
                                    </div>


                                    <div className="wakatime-period-selector">
                                        {activityOptions.map(
                                            (
                                                option,
                                            ) => (
                                                <button
                                                    key={
                                                        option.id
                                                    }
                                                    type="button"
                                                    className={
                                                        activityPeriod ===
                                                            option.id
                                                            ? 'wakatime-period-button active'
                                                            : 'wakatime-period-button'
                                                    }
                                                    onClick={
                                                        () =>
                                                            setActivityPeriod(
                                                                option.id,
                                                            )
                                                    }
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>


                                {activityData.length >
                                    0 ? (
                                    <div className="wakatime-chart">
                                        {activityData.map(
                                            (
                                                item,
                                                index,
                                            ) => (
                                                <div
                                                    className="wakatime-chart-item"
                                                    key={`${item.label}-${index}`}
                                                >
                                                    <div className="wakatime-chart-column">
                                                        <span className="wakatime-chart-tooltip">
                                                            {
                                                                formatHours(
                                                                    item.value,
                                                                )
                                                            }
                                                        </span>

                                                        <span
                                                            className="wakatime-chart-bar"
                                                            style={{
                                                                height:
                                                                    `${Math.max(
                                                                        (
                                                                            item.value /
                                                                            activityMax
                                                                        ) *
                                                                        100,
                                                                        3,
                                                                    )}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <span className="wakatime-chart-label">
                                                        {
                                                            item.label
                                                        }
                                                    </span>
                                                </div>
                                            ),
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
                                            ?.public_repos
                                    }
                                </strong>
                            </div>


                            <div className="github-stat">
                                <span>
                                    Linguagem principal
                                </span>

                                <strong>
                                    {
                                        getMainLanguage()
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
                                            ?.followers
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
                                            ?.following
                                    }
                                </strong>
                            </div>


                            <div className="github-stat">
                                <span>
                                    Estrelas
                                </span>

                                <strong>
                                    {
                                        getTotalStars()
                                    }
                                </strong>
                            </div>


                            <div className="github-stat">
                                <span>
                                    GitHub desde
                                </span>

                                <strong>
                                    {
                                        getAccountYear()
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