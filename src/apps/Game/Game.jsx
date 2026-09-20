import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    Pause,
    Play,
    RotateCcw,
    Trophy,
} from 'lucide-react'

import {
    FaJava,
} from 'react-icons/fa'

import {
    SiCss,
    SiDocker,
    SiGit,
    SiHtml5,
    SiJavascript,
    SiPython,
    SiSpring,
} from 'react-icons/si'

import {
    isSupabaseConfigured,
    supabase,
} from '../../lib/supabase'

import './Game.css'


/* === CONFIGURAÇÃO === */

const boardSize =
    20


/* === TECNOLOGIAS === */

const foodTechnologies = [
    {
        id:
            'java',

        name:
            'Java',

        icon:
            FaJava,

        color:
            '#f89820',
    },

    {
        id:
            'javascript',

        name:
            'JavaScript',

        icon:
            SiJavascript,

        color:
            '#f7df1e',
    },

    {
        id:
            'python',

        name:
            'Python',

        icon:
            SiPython,

        color:
            '#3776ab',
    },

    {
        id:
            'html',

        name:
            'HTML',

        icon:
            SiHtml5,

        color:
            '#e34f26',
    },

    {
        id:
            'css',

        name:
            'CSS',

        icon:
            SiCss,

        color:
            '#1572b6',
    },

    {
        id:
            'docker',

        name:
            'Docker',

        icon:
            SiDocker,

        color:
            '#2496ed',
    },

    {
        id:
            'git',

        name:
            'Git',

        icon:
            SiGit,

        color:
            '#f05032',
    },

    {
        id:
            'spring',

        name:
            'Spring',

        icon:
            SiSpring,

        color:
            '#6db33f',
    },
]


/* === ESTADO INICIAL === */

const initialSnake = [
    {
        x:
            10,

        y:
            10,
    },

    {
        x:
            9,

        y:
            10,
    },

    {
        x:
            8,

        y:
            10,
    },
]


const initialDirection = {
    x:
        1,

    y:
        0,
}


function getRandomTechnology() {
    return foodTechnologies[
        Math.floor(
            Math.random() *
            foodTechnologies.length,
        )
    ].id
}


function createInitialFoods() {
    return [
        {
            x:
                14,

            y:
                10,

            technology:
                getRandomTechnology(),
        },

        {
            x:
                5,

            y:
                5,

            technology:
                getRandomTechnology(),
        },
    ]
}


function Game({
    isActive = true,
}) {
    /* === JOGO === */

    const [
        snake,
        setSnake,
    ] = useState(
        initialSnake,
    )

    const [
        foods,
        setFoods,
    ] = useState(
        createInitialFoods,
    )

    const [
        score,
        setScore,
    ] = useState(
        0,
    )

    const [
        record,
        setRecord,
    ] = useState(
        () =>
            Number(
                localStorage.getItem(
                    'snake-record',
                ) ??
                0,
            ),
    )

    const [
        gameOver,
        setGameOver,
    ] = useState(
        false,
    )

    const [
        paused,
        setPaused,
    ] = useState(
        false,
    )


    /* === RANKING === */

    const [
        ranking,
        setRanking,
    ] = useState(
        [],
    )

    const [
        rankingStatus,
        setRankingStatus,
    ] = useState(
        'loading',
    )

    const [
        qualifiesForRanking,
        setQualifiesForRanking,
    ] = useState(
        false,
    )

    const [
        playerName,
        setPlayerName,
    ] = useState(
        '',
    )

    const [
        saveError,
        setSaveError,
    ] = useState(
        '',
    )


    /* === REFS === */

    const directionRef =
        useRef(
            initialDirection,
        )

    const snakeRef =
        useRef(
            initialSnake,
        )

    const foodsRef =
        useRef(
            foods,
        )

    const scoreRef =
        useRef(
            0,
        )

    const recordRef =
        useRef(
            record,
        )

    const rankingRef =
        useRef(
            [],
        )


    /* === RANKING GLOBAL === */

    const loadRanking =
        async () => {
            if (
                !isSupabaseConfigured ||
                !supabase
            ) {
                setRanking(
                    [],
                )

                setRankingStatus(
                    'unavailable',
                )

                rankingRef.current =
                    []

                return
            }


            setRankingStatus(
                'loading',
            )


            const {
                data,
                error,
            } =
                await supabase
                    .from(
                        'snake_scores',
                    )
                    .select(
                        'player_name, score',
                    )
                    .order(
                        'score',
                        {
                            ascending:
                                false,
                        },
                    )
                    .limit(
                        5,
                    )


            if (
                error
            ) {
                console.error(
                    'Erro ao carregar ranking:',
                    error,
                )

                setRankingStatus(
                    'error',
                )

                return
            }


            const scores =
                data ??
                []


            setRanking(
                scores,
            )

            rankingRef.current =
                scores


            setRankingStatus(
                'success',
            )
        }


    const scoreQualifiesForTop5 =
        (
            finalScore,
        ) => {
            if (
                !isSupabaseConfigured ||
                !supabase ||
                finalScore <=
                0
            ) {
                return false
            }


            const currentRanking =
                rankingRef.current


            if (
                currentRanking.length <
                5
            ) {
                return true
            }


            const fifthPlaceScore =
                Number(
                    currentRanking[4]
                        ?.score ??
                    0,
                )


            return (
                finalScore >
                fifthPlaceScore
            )
        }


    const saveGlobalRecord =
        async (
            newScore,
            name = '',
        ) => {
            if (
                !isSupabaseConfigured ||
                !supabase
            ) {
                setSaveError(
                    'Ranking indisponível.',
                )

                return
            }


            const trimmedName =
                name.trim() ||
                'Visitante'


            setSaveError(
                '',
            )


            const {
                error,
            } =
                await supabase
                    .from(
                        'snake_scores',
                    )
                    .insert({
                        player_name:
                            trimmedName,

                        score:
                            newScore,
                    })


            if (
                error
            ) {
                console.error(
                    'Erro ao salvar pontuação:',
                    error,
                )

                setSaveError(
                    'Não foi possível salvar.',
                )

                return
            }


            setQualifiesForRanking(
                false,
            )

            setPlayerName(
                '',
            )


            await loadRanking()
        }


    useEffect(() => {
        const timer =
            setTimeout(
                () => {
                    loadRanking()
                },
                0,
            )


        return () => {
            clearTimeout(
                timer,
            )
        }
    }, [])


    /* === PAUSA AUTOMÁTICA === */

    useEffect(() => {
        if (
            isActive ||
            gameOver
        ) {
            return
        }


        const timer =
            setTimeout(
                () => {
                    setPaused(
                        true,
                    )
                },
                0,
            )


        return () => {
            clearTimeout(
                timer,
            )
        }
    }, [
        isActive,
        gameOver,
    ])


    useEffect(() => {
        const handleBlur =
            () => {
                if (
                    !gameOver
                ) {
                    setPaused(
                        true,
                    )
                }
            }


        const handleVisibility =
            () => {
                if (
                    document.hidden &&
                    !gameOver
                ) {
                    setPaused(
                        true,
                    )
                }
            }


        window.addEventListener(
            'blur',
            handleBlur,
        )

        document.addEventListener(
            'visibilitychange',
            handleVisibility,
        )


        return () => {
            window.removeEventListener(
                'blur',
                handleBlur,
            )

            document.removeEventListener(
                'visibilitychange',
                handleVisibility,
            )
        }
    }, [
        gameOver,
    ])


    /* === NOVA COMIDA === */

    const getRandomFood =
        (
            currentSnake,
            otherFoods = [],
        ) => {
            let newFood


            do {
                newFood = {
                    x:
                        Math.floor(
                            Math.random() *
                            boardSize,
                        ),

                    y:
                        Math.floor(
                            Math.random() *
                            boardSize,
                        ),

                    technology:
                        getRandomTechnology(),
                }
            } while (
                currentSnake.some(
                    (
                        segment,
                    ) =>
                        segment.x ===
                        newFood.x &&
                        segment.y ===
                        newFood.y,
                ) ||

                otherFoods.some(
                    (
                        food,
                    ) =>
                        food.x ===
                        newFood.x &&
                        food.y ===
                        newFood.y,
                )
            )


            return newFood
        }


    /* === DIREÇÃO === */

    const changeDirection =
        useCallback(
            (
                newDirection,
            ) => {
            if (
                gameOver ||
                paused ||
                !isActive
            ) {
                return
            }


            const currentDirection =
                directionRef.current


            const opposite =
                newDirection.x ===
                -currentDirection.x &&
                newDirection.y ===
                -currentDirection.y


            if (
                opposite
            ) {
                return
            }


                directionRef.current =
                    newDirection
            },
            [
                gameOver,
                paused,
                isActive,
            ],
        )


    /* === REINICIAR === */

    const resetGame =
        useCallback(
            () => {
            const newFoods =
                createInitialFoods()


            setSnake(
                initialSnake,
            )

            setFoods(
                newFoods,
            )


            snakeRef.current =
                initialSnake

            foodsRef.current =
                newFoods

            directionRef.current =
                initialDirection

            scoreRef.current =
                0


            setScore(
                0,
            )

            setGameOver(
                false,
            )

            setPaused(
                false,
            )

            setQualifiesForRanking(
                false,
            )

            setPlayerName(
                '',
            )

            setSaveError(
                '',
            )
            },
            [],
        )


    /* === PAUSAR === */

    const togglePause =
        useCallback(
            () => {
                if (
                    gameOver
                ) {
                    return
                }


                setPaused(
                    (
                        current,
                    ) =>
                        !current,
                )
            },
            [
                gameOver,
            ],
        )


    /* === TECLADO === */

    useEffect(() => {
        const handleKeyDown =
            (
                event,
            ) => {
                const target =
                    event.target


                if (
                    target instanceof
                    HTMLInputElement ||
                    target instanceof
                    HTMLTextAreaElement
                ) {
                    return
                }


                if (
                    !isActive
                ) {
                    return
                }


                const key =
                    event.key
                        .toLowerCase()


                if (
                    key ===
                    'p'
                ) {
                    togglePause()

                    return
                }


                if (
                    key ===
                    'r'
                ) {
                    resetGame()

                    return
                }


                if (
                    key ===
                    'arrowup' ||
                    key ===
                    'w'
                ) {
                    event.preventDefault()

                    changeDirection({
                        x:
                            0,

                        y:
                            -1,
                    })

                    return
                }


                if (
                    key ===
                    'arrowdown' ||
                    key ===
                    's'
                ) {
                    event.preventDefault()

                    changeDirection({
                        x:
                            0,

                        y:
                            1,
                    })

                    return
                }


                if (
                    key ===
                    'arrowleft' ||
                    key ===
                    'a'
                ) {
                    event.preventDefault()

                    changeDirection({
                        x:
                            -1,

                        y:
                            0,
                    })

                    return
                }


                if (
                    key ===
                    'arrowright' ||
                    key ===
                    'd'
                ) {
                    event.preventDefault()

                    changeDirection({
                        x:
                            1,

                        y:
                            0,
                    })
                }
            }


        window.addEventListener(
            'keydown',
            handleKeyDown,
        )


        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown,
            )
        }
    }, [
        isActive,
        changeDirection,
        resetGame,
        togglePause,
    ])


    /* === LOOP DO JOGO === */

    useEffect(() => {
        if (
            gameOver ||
            paused ||
            !isActive
        ) {
            return
        }


        const speed =
            Math.max(
                85,
                165 -
                score *
                3,
            )


        const interval =
            setInterval(
                () => {
                    const currentSnake =
                        snakeRef.current

                    const currentFoods =
                        foodsRef.current

                    const head =
                        currentSnake[0]


                    const nextHead = {
                        x:
                            head.x +
                            directionRef
                                .current
                                .x,

                        y:
                            head.y +
                            directionRef
                                .current
                                .y,
                    }


                    const hitWall =
                        nextHead.x <
                        0 ||
                        nextHead.x >=
                        boardSize ||
                        nextHead.y <
                        0 ||
                        nextHead.y >=
                        boardSize


                    const eatenFoodIndex =
                        currentFoods.findIndex(
                            (
                                currentFood,
                            ) =>
                                nextHead.x ===
                                currentFood.x &&
                                nextHead.y ===
                                currentFood.y,
                        )


                    const ateFood =
                        eatenFoodIndex !==
                        -1


                    const bodyToCheck =
                        ateFood
                            ? currentSnake
                            : currentSnake.slice(
                                0,
                                -1,
                            )


                    const hitSnake =
                        bodyToCheck.some(
                            (
                                segment,
                            ) =>
                                segment.x ===
                                nextHead.x &&
                                segment.y ===
                                nextHead.y,
                        )


                    if (
                        hitWall ||
                        hitSnake
                    ) {
                        const finalScore =
                            scoreRef.current


                        setGameOver(
                            true,
                        )

                        setQualifiesForRanking(
                            scoreQualifiesForTop5(
                                finalScore,
                            ),
                        )

                        return
                    }


                    const nextSnake = [
                        nextHead,
                        ...currentSnake,
                    ]


                    if (
                        ateFood
                    ) {
                        const newScore =
                            scoreRef.current +
                            1


                        scoreRef.current =
                            newScore


                        setScore(
                            newScore,
                        )


                        if (
                            newScore >
                            recordRef.current
                        ) {
                            recordRef.current =
                                newScore


                            setRecord(
                                newScore,
                            )


                            localStorage.setItem(
                                'snake-record',
                                newScore,
                            )
                        }


                        const remainingFoods =
                            currentFoods.filter(
                                (
                                    _,
                                    index,
                                ) =>
                                    index !==
                                    eatenFoodIndex,
                            )


                        const newFood =
                            getRandomFood(
                                nextSnake,
                                remainingFoods,
                            )


                        const nextFoods = [
                            ...remainingFoods,
                            newFood,
                        ]


                        foodsRef.current =
                            nextFoods


                        setFoods(
                            nextFoods,
                        )
                    } else {
                        nextSnake.pop()
                    }


                    snakeRef.current =
                        nextSnake


                    setSnake(
                        nextSnake,
                    )
                },
                speed,
            )


        return () => {
            clearInterval(
                interval,
            )
        }
    }, [
        score,
        gameOver,
        paused,
        isActive,
    ])


    /* === POSIÇÃO === */

    const getPositionStyle =
        (
            x,
            y,
        ) => {
            const cellSize =
                100 /
                boardSize


            return {
                width:
                    `${cellSize}%`,

                height:
                    `${cellSize}%`,

                left:
                    `${x * cellSize}%`,

                top:
                    `${y * cellSize}%`,
            }
        }


    /* === TECNOLOGIA === */

    return (
        <div className="game">

            {/* === CABEÇALHO === */}

            <header className="game-header">
                <div>
                    <span className="game-label">
                        Arcade
                    </span>

                    <h1>
                        Snake
                    </h1>

                    <p>
                        Setas / WASD para jogar
                    </p>
                </div>


                <div className="game-header-right">

                    <span
                        className={[
                            'game-status',

                            paused
                                ? 'game-status-paused'
                                : '',

                            gameOver
                                ? 'game-status-over'
                                : '',
                        ]
                            .filter(
                                Boolean,
                            )
                            .join(
                                ' ',
                            )}
                    >
                        <span />

                        {gameOver
                            ? 'Game Over'
                            : paused
                                ? 'Pausado'
                                : 'Jogando'}
                    </span>


                    <button
                        type="button"
                        onClick={
                            togglePause
                        }
                        disabled={
                            gameOver
                        }
                    >
                        {paused ? (
                            <Play
                                size={14}
                                strokeWidth={1.8}
                            />
                        ) : (
                            <Pause
                                size={14}
                                strokeWidth={1.8}
                            />
                        )}

                        {paused
                            ? 'Continuar'
                            : 'Pausar'}
                    </button>


                    <button
                        type="button"
                        onClick={
                            resetGame
                        }
                    >
                        <RotateCcw
                            size={14}
                            strokeWidth={1.8}
                        />

                        Reiniciar
                    </button>
                </div>
            </header>


            {/* === ÁREA PRINCIPAL === */}

            <div className="game-main">

                {/* === TABULEIRO === */}

                <section className="game-play">
                    <div className="game-board">

                        {/* === COBRA === */}

                        {snake.map(
                            (
                                segment,
                                index,
                            ) => (
                                <div
                                    key={`${segment.x}-${segment.y}-${index}`}
                                    className={
                                        index ===
                                            0
                                            ? 'snake-segment snake-head'
                                            : 'snake-segment'
                                    }
                                    style={
                                        getPositionStyle(
                                            segment.x,
                                            segment.y,
                                        )
                                    }
                                />
                            ),
                        )}


                        {/* === COMIDAS === */}

                        {foods.map(
                            (
                                food,
                                index,
                            ) => {
                                const technology =
                                    foodTechnologies.find(
                                        (
                                            item,
                                        ) =>
                                            item.id ===
                                            food.technology,
                                    ) ??
                                    foodTechnologies[0]


                                const FoodIcon =
                                    technology.icon


                                return (
                                    <div
                                        className="game-food"
                                        key={`${food.x}-${food.y}-${food.technology}-${index}`}
                                        style={
                                            getPositionStyle(
                                                food.x,
                                                food.y,
                                            )
                                        }
                                        title={
                                            technology.name
                                        }
                                    >
                                        <span
                                            className="game-food-icon"
                                            style={{
                                                '--food-color':
                                                    technology.color,
                                            }}
                                        >
                                            <FoodIcon />
                                        </span>
                                    </div>
                                )
                            },
                        )}


                        {/* === OVERLAY === */}

                        {(gameOver ||
                            paused) && (
                                <div className="game-overlay">

                                    {gameOver ? (
                                        <>
                                            <Trophy
                                                size={28}
                                                strokeWidth={1.6}
                                            />

                                            <strong>
                                                Game Over
                                            </strong>

                                            <span>
                                                {score} pontos
                                            </span>


                                            {qualifiesForRanking ? (
                                                <div className="game-record-form">
                                                    <b>
                                                        Você entrou no Top 5!
                                                    </b>

                                                    <input
                                                        type="text"
                                                        maxLength={
                                                            20
                                                        }
                                                        placeholder="Seu nome"
                                                        value={
                                                            playerName
                                                        }
                                                        onChange={
                                                            (
                                                                event,
                                                            ) =>
                                                                setPlayerName(
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                        }
                                                    />

                                                    {saveError && (
                                                        <small>
                                                            {
                                                                saveError
                                                            }
                                                        </small>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            () =>
                                                                saveGlobalRecord(
                                                                    score,
                                                                    playerName,
                                                                )
                                                        }
                                                    >
                                                        Salvar pontuação
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="game-secondary-button"
                                                        onClick={
                                                            resetGame
                                                        }
                                                    >
                                                        Jogar novamente
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        resetGame
                                                    }
                                                >
                                                    Jogar novamente
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Pause
                                                size={28}
                                                strokeWidth={1.6}
                                            />

                                            <strong>
                                                Pausado
                                            </strong>

                                            <button
                                                type="button"
                                                onClick={
                                                    togglePause
                                                }
                                            >
                                                Continuar
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                    </div>


                    <span className="game-hint">
                        P pausa · R reinicia
                    </span>
                </section>


                {/* === PAINEL LATERAL === */}

                <aside className="game-sidebar">

                    {/* === PONTUAÇÃO === */}

                    <div className="game-score">
                        <div>
                            <span>
                                Pontos
                            </span>

                            <strong>
                                {score}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Recorde
                            </span>

                            <strong>
                                {record}
                            </strong>
                        </div>
                    </div>


                    {/* === RANKING === */}

                    <div className="game-ranking">
                        <div className="game-ranking-header">
                            <div>
                                <span>
                                    Ranking
                                </span>

                                <h2>
                                    Top 5
                                </h2>
                            </div>

                            <Trophy
                                size={18}
                                strokeWidth={1.7}
                            />
                        </div>


                        <div className="game-ranking-list">

                            {rankingStatus ===
                                'loading' && (
                                    <div className="game-ranking-empty">
                                        Carregando...
                                    </div>
                                )}


                            {rankingStatus ===
                                'error' && (
                                    <div className="game-ranking-empty">
                                        Erro ao carregar.
                                    </div>
                                )}


                            {rankingStatus ===
                                'unavailable' && (
                                    <div className="game-ranking-empty">
                                        Ranking indisponível.
                                    </div>
                                )}


                            {rankingStatus ===
                                'success' &&
                                ranking.length ===
                                0 && (
                                    <div className="game-ranking-empty">
                                        Nenhum recorde.
                                    </div>
                                )}


                            {rankingStatus ===
                                'success' &&
                                ranking.map(
                                    (
                                        player,
                                        index,
                                    ) => (
                                        <div
                                            className={[
                                                'game-ranking-item',

                                                index ===
                                                    0
                                                    ? 'game-ranking-first'
                                                    : '',
                                            ]
                                                .filter(
                                                    Boolean,
                                                )
                                                .join(
                                                    ' ',
                                                )}
                                            key={`${player.player_name}-${player.score}-${index}`}
                                        >
                                            <span>
                                                {index + 1}
                                            </span>

                                            <p>
                                                {player.player_name ||
                                                    'Visitante'}
                                            </p>

                                            <strong>
                                                {
                                                    player.score
                                                }
                                            </strong>
                                        </div>
                                    ),
                                )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}


export default Game