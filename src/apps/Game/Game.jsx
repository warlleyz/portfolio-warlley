import {
    useEffect,
    useRef,
    useState,
} from 'react'

import { supabase } from '../../lib/supabase'

import './Game.css'

const boardSize = 20

const initialSnake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
]

const initialDirection = {
    x: 1,
    y: 0,
}

function Game({
    isActive = true,
}) {
    const [snake, setSnake] =
        useState(initialSnake)

    const [food, setFood] =
        useState({
            x: 14,
            y: 10,
        })

    const [score, setScore] =
        useState(0)

    const [record, setRecord] =
        useState(() => {
            return Number(
                localStorage.getItem(
                    'snake-record',
                ) ?? 0,
            )
        })

    const [
        globalRecord,
        setGlobalRecord,
    ] = useState(0)

    const [
        globalPlayer,
        setGlobalPlayer,
    ] = useState('')

    const [
        ranking,
        setRanking,
    ] = useState([])

    const [
        newGlobalRecord,
        setNewGlobalRecord,
    ] = useState(false)

    const [
        playerName,
        setPlayerName,
    ] = useState('')

    const [gameOver, setGameOver] =
        useState(false)

    const [paused, setPaused] =
        useState(false)

    const directionRef =
        useRef(initialDirection)

    const globalRecordRef =
        useRef(0)

    /* === RANKING GLOBAL === */

    const loadRanking =
        async () => {
            const {
                data,
                error,
            } = await supabase
                .from('snake_scores')
                .select(
                    'player_name, score',
                )
                .order(
                    'score',
                    {
                        ascending: false,
                    },
                )
                .limit(5)

            if (error) {
                console.error(
                    'Erro ao carregar ranking:',
                    error,
                )

                return
            }

            const scores =
                data ?? []

            setRanking(
                scores,
            )

            const bestScore =
                scores[0]?.score ?? 0

            const bestPlayer =
                scores[0]?.player_name ??
                ''

            setGlobalRecord(
                bestScore,
            )

            setGlobalPlayer(
                bestPlayer,
            )

            globalRecordRef.current =
                bestScore
        }

    const saveGlobalRecord =
        async (
            newScore,
            name = '',
        ) => {
            const trimmedName =
                name.trim() ||
                'Visitante'

            const {
                error,
            } = await supabase
                .from('snake_scores')
                .insert({
                    player_name:
                        trimmedName,

                    score:
                        newScore,
                })

            if (error) {
                console.error(
                    'Erro ao salvar recorde:',
                    error,
                )

                return
            }

            setNewGlobalRecord(
                false,
            )

            setPlayerName('')

            await loadRanking()
        }

    useEffect(() => {
        loadRanking()
    }, [])

    /* === FOCO DO JOGO === */

    useEffect(() => {
        if (
            !isActive &&
            !gameOver
        ) {
            setPaused(true)
        }
    }, [
        isActive,
        gameOver,
    ])

    useEffect(() => {
        const handleWindowBlur = () => {
            if (!gameOver) {
                setPaused(true)
            }
        }

        const handleVisibilityChange =
            () => {
                if (
                    document.hidden &&
                    !gameOver
                ) {
                    setPaused(true)
                }
            }

        window.addEventListener(
            'blur',
            handleWindowBlur,
        )

        document.addEventListener(
            'visibilitychange',
            handleVisibilityChange,
        )

        return () => {
            window.removeEventListener(
                'blur',
                handleWindowBlur,
            )

            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            )
        }
    }, [
        gameOver,
        isActive,
    ])

    /* === COMIDA === */

    const getRandomFood = (
        currentSnake,
    ) => {
        let newFood

        do {
            newFood = {
                x: Math.floor(
                    Math.random() *
                    boardSize,
                ),

                y: Math.floor(
                    Math.random() *
                    boardSize,
                ),
            }
        } while (
            currentSnake.some(
                (segment) =>
                    segment.x ===
                    newFood.x &&
                    segment.y ===
                    newFood.y,
            )
        )

        return newFood
    }

    /* === REINICIAR === */

    const resetGame = () => {
        setSnake(
            initialSnake,
        )

        setFood({
            x: 14,
            y: 10,
        })

        directionRef.current =
            initialDirection

        setScore(0)
        setGameOver(false)
        setPaused(false)
        setNewGlobalRecord(false)
        setPlayerName('')
    }

    /* === CONTROLES === */

    useEffect(() => {
        const handleKeyDown = (
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

            const key =
                event.key.toLowerCase()

            if (!isActive) {
                return
            }

            if (key === 'p') {
                if (!gameOver) {
                    setPaused(
                        (current) =>
                            !current,
                    )
                }

                return
            }

            if (key === 'r') {
                resetGame()

                return
            }

            let newDirection =
                null

            if (
                key === 'arrowup' ||
                key === 'w'
            ) {
                event.preventDefault()

                newDirection = {
                    x: 0,
                    y: -1,
                }
            }

            if (
                key === 'arrowdown' ||
                key === 's'
            ) {
                event.preventDefault()

                newDirection = {
                    x: 0,
                    y: 1,
                }
            }

            if (
                key === 'arrowleft' ||
                key === 'a'
            ) {
                event.preventDefault()

                newDirection = {
                    x: -1,
                    y: 0,
                }
            }

            if (
                key === 'arrowright' ||
                key === 'd'
            ) {
                event.preventDefault()

                newDirection = {
                    x: 1,
                    y: 0,
                }
            }

            if (!newDirection) {
                return
            }

            const currentDirection =
                directionRef.current

            const oppositeDirection =
                newDirection.x ===
                -currentDirection.x &&
                newDirection.y ===
                -currentDirection.y

            if (oppositeDirection) {
                return
            }

            directionRef.current =
                newDirection
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
    }, [gameOver])

    /* === LOOP DO JOGO === */

    useEffect(() => {
        if (
            gameOver ||
            paused
        ) {
            return
        }

        const speed =
            Math.max(
                85,
                165 - score * 3,
            )

        const interval =
            setInterval(() => {
                setSnake(
                    (currentSnake) => {
                        const head =
                            currentSnake[0]

                        const nextHead = {
                            x:
                                head.x +
                                directionRef
                                    .current.x,

                            y:
                                head.y +
                                directionRef
                                    .current.y,
                        }

                        const hitWall =
                            nextHead.x < 0 ||
                            nextHead.x >=
                            boardSize ||
                            nextHead.y < 0 ||
                            nextHead.y >=
                            boardSize

                        const ateFood =
                            nextHead.x ===
                            food.x &&
                            nextHead.y ===
                            food.y

                        const bodyToCheck =
                            ateFood
                                ? currentSnake
                                : currentSnake.slice(
                                    0,
                                    -1,
                                )

                        const hitSnake =
                            bodyToCheck.some(
                                (segment) =>
                                    segment.x ===
                                    nextHead.x &&
                                    segment.y ===
                                    nextHead.y,
                            )

                        if (
                            hitWall ||
                            hitSnake
                        ) {
                            setGameOver(
                                true,
                            )

                            if (
                                score >
                                globalRecordRef
                                    .current
                            ) {
                                setNewGlobalRecord(
                                    true,
                                )
                            }

                            return currentSnake
                        }

                        const nextSnake = [
                            nextHead,
                            ...currentSnake,
                        ]

                        if (ateFood) {
                            setScore(
                                (
                                    currentScore,
                                ) => {
                                    const newScore =
                                        currentScore +
                                        1

                                    setRecord(
                                        (
                                            currentRecord,
                                        ) => {
                                            const newRecord =
                                                Math.max(
                                                    currentRecord,
                                                    newScore,
                                                )

                                            localStorage
                                                .setItem(
                                                    'snake-record',
                                                    newRecord,
                                                )

                                            return newRecord
                                        },
                                    )

                                    return newScore
                                },
                            )

                            setFood(
                                getRandomFood(
                                    nextSnake,
                                ),
                            )

                            return nextSnake
                        }

                        nextSnake.pop()

                        return nextSnake
                    },
                )
            }, speed)

        return () => {
            clearInterval(
                interval,
            )
        }
    }, [
        food,
        score,
        gameOver,
        paused,
    ])

    /* === POSIÇÃO === */

    const getPositionStyle = (
        x,
        y,
    ) => {
        const cellSize =
            100 / boardSize

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

    return (
        <div className="game">
            <div className="game-header">
                <div>
                    <span className="game-label">
                        Arcade
                    </span>

                    <h1>
                        Snake
                    </h1>

                    <p>
                        Setas ou WASD para jogar.
                        P pausa e R reinicia.
                    </p>
                </div>

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
                            Seu recorde
                        </span>

                        <strong>
                            {record}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Global
                        </span>

                        <strong>
                            {globalRecord}
                        </strong>

                        {globalPlayer && (
                            <small>
                                {globalPlayer}
                            </small>
                        )}
                    </div>
                </div>
            </div>

            <div className="game-main">
                <div className="game-container">
                    <div className="game-board">
                        {snake.map(
                            (
                                segment,
                                index,
                            ) => (
                                <div
                                    key={
                                        `${segment.x}-${segment.y}-${index}`
                                    }
                                    className={
                                        index === 0
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

                        <div
                            className="game-food"
                            style={
                                getPositionStyle(
                                    food.x,
                                    food.y,
                                )
                            }
                        />

                        {(gameOver ||
                            paused) && (
                                <div className="game-overlay">
                                    {gameOver ? (
                                        <>
                                            <strong>
                                                Game Over
                                            </strong>

                                            <span>
                                                Pontuação: {score}
                                            </span>

                                            {newGlobalRecord ? (
                                                <div className="game-record-form">
                                                    <span className="game-global-record">
                                                        Novo recorde global!
                                                    </span>

                                                    <input
                                                        type="text"
                                                        maxLength={20}
                                                        placeholder="Seu nome"
                                                        value={
                                                            playerName
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            setPlayerName(
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            saveGlobalRecord(
                                                                score,
                                                                playerName,
                                                            )
                                                        }
                                                    >
                                                        Salvar recorde
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
                                            <strong>
                                                Pausado
                                            </strong>

                                            <span>
                                                Pressione P para continuar
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                    </div>
                </div>

                <div className="game-ranking">
                    <div className="game-ranking-header">
                        <span>
                            Top 5
                        </span>

                        <span>
                            Recordes globais
                        </span>
                    </div>

                    <div className="game-ranking-list">
                        {ranking.length > 0 ? (
                            ranking.map(
                                (
                                    player,
                                    index,
                                ) => (
                                    <div
                                        className="game-ranking-item"
                                        key={
                                            `${player.player_name}-${player.score}-${index}`
                                        }
                                    >
                                        <span className="game-ranking-position">
                                            {index + 1}º
                                        </span>

                                        <span className="game-ranking-name">
                                            {player.player_name ||
                                                'Visitante'}
                                        </span>

                                        <strong>
                                            {player.score}
                                        </strong>
                                    </div>
                                ),
                            )
                        ) : (
                            <div className="game-ranking-empty">
                                Nenhum recorde ainda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game