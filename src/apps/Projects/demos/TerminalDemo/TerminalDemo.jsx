import {
    useEffect,
    useRef,
    useState,
} from 'react'

import {
    RotateCcw,
    TerminalSquare,
} from 'lucide-react'

import './TerminalDemo.css'


function TerminalDemo({
    project,
}) {
    
    /* === ESTADO DO TERMINAL === */
    const [
        command,
        setCommand,
    ] = useState('')

    const [
        history,
        setHistory,
    ] = useState([])

    const [
        commandHistory,
        setCommandHistory,
    ] = useState([])

    const [
        historyIndex,
        setHistoryIndex,
    ] = useState(null)

    const [
        draftCommand,
        setDraftCommand,
    ] = useState('')


    /* === ESTADO DA DEMO === */
    const [
        currentStep,
        setCurrentStep,
    ] = useState('idle')

    const [
        cart,
        setCart,
    ] = useState([])

    const [
        temporaryProduct,
        setTemporaryProduct,
    ] = useState({})


    /* === REFERÊNCIAS === */
    const terminalRef =
        useRef(null)

    const inputRef =
        useRef(null)


    /* === CONFIGURAÇÃO === */
    const demo =
        project.demo ??
        {}

    const initialCommand =
        demo.command ??
        'comando'


    /* === SCROLL AUTOMÁTICO === */
    useEffect(() => {
        const terminal =
            terminalRef.current

        if (
            !terminal
        ) {
            return
        }

        const frame =
            requestAnimationFrame(
                () => {
                    terminal.scrollTop =
                        terminal.scrollHeight
                },
            )

        return () => {
            cancelAnimationFrame(
                frame,
            )
        }
    }, [
        history,
    ])


    /* === FOCO NO TERMINAL === */
    const focusInput =
        () => {
            requestAnimationFrame(
                () => {
                    inputRef.current
                        ?.focus()
                },
            )
        }


    /* === ADICIONAR AO HISTÓRICO VISUAL === */
    const addHistory = (
        typedCommand,
        output,
    ) => {
        setHistory(
            (
                previous,
            ) => [
                    ...previous,

                    {
                        command:
                            typedCommand,

                        output,
                    },
                ],
        )
    }


    /* === REGISTRAR COMANDO === */
    const registerCommand = (
        typedCommand,
    ) => {
        setCommandHistory(
            (
                previous,
            ) => {
                const lastCommand =
                    previous[
                    previous.length - 1
                    ]

                if (
                    lastCommand ===
                    typedCommand
                ) {
                    return previous
                }

                return [
                    ...previous,
                    typedCommand,
                ]
            },
        )

        setHistoryIndex(
            null,
        )

        setDraftCommand(
            '',
        )
    }


    /* === MENU DO CARRINHO === */
    const getCartMenu =
        () =>
            `=== CARRINHO DE COMPRAS ===

            1 - Adicionar produto
            2 - Remover produto
            3 - Listar produtos
            4 - Finalizar compra

            Escolha uma opção:`


    /* === LIMPAR TELA === */
    const clearTerminal =
        () => {
            setHistory(
                [],
            )

            setCommand(
                '',
            )

            setHistoryIndex(
                null,
            )

            setDraftCommand(
                '',
            )

            focusInput()
        }


    /* === REINICIAR DEMO === */
    const resetTerminal =
        () => {
            setHistory(
                [],
            )

            setCommand(
                '',
            )

            setCommandHistory(
                [],
            )

            setHistoryIndex(
                null,
            )

            setDraftCommand(
                '',
            )

            setCurrentStep(
                'idle',
            )

            setCart(
                [],
            )

            setTemporaryProduct(
                {},
            )

            focusInput()
        }


    /* === COMANDO SIMPLES === */
    const executeSimpleCommand = (
        typedCommand,
    ) => {
        if (
            typedCommand ===
            demo.command
        ) {
            addHistory(
                typedCommand,
                demo.output ??
                '',
            )

            return
        }

        addHistory(
            typedCommand,
            `Comando não reconhecido: ${typedCommand}`,
        )
    }


    /* === CARRINHO === */
    const executeCartCommand = (
        typedCommand,
    ) => {

        /* ----- INICIALIZAÇÃO ----- */
        if (
            currentStep ===
            'idle'
        ) {
            if (
                typedCommand !==
                demo.command
            ) {
                addHistory(
                    typedCommand,
                    `Comando não reconhecido: ${typedCommand}`,
                )

                return
            }

            addHistory(
                typedCommand,
                getCartMenu(),
            )

            setCurrentStep(
                'menu',
            )

            return
        }


        /* ----- MENU ----- */
        if (
            currentStep ===
            'menu'
        ) {
            switch (
            typedCommand
            ) {
                case '1':
                    addHistory(
                        typedCommand,
                        'Digite o nome do produto:',
                    )

                    setCurrentStep(
                        'product-name',
                    )

                    return

                case '2':
                    if (
                        cart.length ===
                        0
                    ) {
                        addHistory(
                            typedCommand,
                            `O carrinho está vazio.

                            ${getCartMenu()}`,
                        )

                        return
                    }

                    addHistory(
                        typedCommand,
                        'Digite o número do produto que deseja remover:',
                    )

                    setCurrentStep(
                        'remove-product',
                    )

                    return

                case '3': {
                    if (
                        cart.length ===
                        0
                    ) {
                        addHistory(
                            typedCommand,
                            `Carrinho vazio.

                            ${getCartMenu()}`,
                        )

                        return
                    }

                    const products =
                        cart
                            .map(
                                (
                                    product,
                                    index,
                                ) =>
                                    `${index + 1} - ${product.name} - R$ ${product.price.toFixed(2)}`,
                            )
                            .join(
                                '\n',
                            )

                    const total =
                        cart.reduce(
                            (
                                sum,
                                product,
                            ) =>
                                sum +
                                product.price,
                            0,
                        )

                    addHistory(
                        typedCommand,
                        `=== PRODUTOS ===

                        ${products}

                        Total: R$ ${total.toFixed(2)}

                        ${getCartMenu()}`,
                    )

                    return
                }

                case '4': {
                    const total =
                        cart.reduce(
                            (
                                sum,
                                product,
                            ) =>
                                sum +
                                product.price,
                            0,
                        )

                    addHistory(
                        typedCommand,
                        `Compra finalizada.

                        Total: R$ ${total.toFixed(2)}
                        
                        Obrigado por utilizar o programa.`,
                    )

                    setCurrentStep(
                        'finished',
                    )

                    return
                }

                default:
                    addHistory(
                        typedCommand,
                        `Opção inválida.

                        ${getCartMenu()}`,
                    )
            }

            return
        }


        /* ----- NOME DO PRODUTO ----- */
        if (
            currentStep ===
            'product-name'
        ) {
            setTemporaryProduct({
                name:
                    typedCommand,
            })

            addHistory(
                typedCommand,
                'Digite o preço do produto:',
            )

            setCurrentStep(
                'product-price',
            )

            return
        }


        /* ----- PREÇO DO PRODUTO ----- */
        if (
            currentStep ===
            'product-price'
        ) {
            const normalizedValue =
                typedCommand.replace(
                    ',',
                    '.',
                )

            const price =
                Number(
                    normalizedValue,
                )

            if (
                Number.isNaN(
                    price,
                ) ||
                price <= 0
            ) {
                addHistory(
                    typedCommand,
                    'Preço inválido. Digite um valor maior que zero:',
                )

                return
            }

            const product = {
                name:
                    temporaryProduct.name,

                price,
            }

            setCart(
                (
                    previous,
                ) => [
                        ...previous,
                        product,
                    ],
            )

            setTemporaryProduct(
                {},
            )

            addHistory(
                typedCommand,
                `Produto "${product.name}" adicionado com sucesso.

                ${getCartMenu()}`,
            )

            setCurrentStep(
                'menu',
            )

            return
        }


        /* ----- REMOVER PRODUTO ----- */
        if (
            currentStep ===
            'remove-product'
        ) {
            const productNumber =
                Number(
                    typedCommand,
                )

            const isValid =
                Number.isInteger(
                    productNumber,
                ) &&
                productNumber >= 1 &&
                productNumber <=
                cart.length

            if (
                !isValid
            ) {
                addHistory(
                    typedCommand,
                    'Produto inválido. Digite um número inteiro válido:',
                )

                return
            }

            const index =
                productNumber - 1

            const removedProduct =
                cart[index]

            setCart(
                (
                    previous,
                ) =>
                    previous.filter(
                        (
                            _,
                            productIndex,
                        ) =>
                            productIndex !==
                            index,
                    ),
            )

            addHistory(
                typedCommand,
                `Produto "${removedProduct.name}" removido.

                ${getCartMenu()}`,
            )

            setCurrentStep(
                'menu',
            )

            return
        }


        /* ----- PROGRAMA FINALIZADO ----- */
        if (
            currentStep ===
            'finished'
        ) {
            addHistory(
                typedCommand,
                'O programa foi encerrado. Digite clear para limpar a tela ou use Reiniciar para executar novamente.',
            )
        }
    }


    /* === EXECUTAR COMANDO === */
    const executeCommand =
        () => {
            const typedCommand =
                command.trim()

            if (
                !typedCommand
            ) {
                return
            }

            registerCommand(
                typedCommand,
            )


            /* ----- LIMPAR ----- */
            if (
                typedCommand ===
                'clear'
            ) {
                clearTerminal()

                return
            }


            /* ----- AJUDA ----- */
            if (
                typedCommand ===
                'help'
            ) {
                addHistory(
                    typedCommand,
                    `Comandos disponíveis:
                        ${demo.command ?? 'Nenhum comando configurado'}
                        help
                        clear

                        Use ↑ e ↓ para navegar pelo histórico de comandos.`,
                )

                setCommand(
                    '',
                )

                focusInput()

                return
            }


            /* ----- DEMO ----- */
            if (
                demo.mode ===
                'cart'
            ) {
                executeCartCommand(
                    typedCommand,
                )
            } else {
                executeSimpleCommand(
                    typedCommand,
                )
            }

            setCommand(
                '',
            )

            focusInput()
        }


    /* === HISTÓRICO COM SETAS === */
    const navigateCommandHistory = (
        direction,
    ) => {
        if (
            commandHistory.length ===
            0
        ) {
            return
        }


        /* ----- SUBIR ----- */
        if (
            direction ===
            'up'
        ) {
            if (
                historyIndex ===
                null
            ) {
                setDraftCommand(
                    command,
                )

                const nextIndex =
                    commandHistory.length -
                    1

                setHistoryIndex(
                    nextIndex,
                )

                setCommand(
                    commandHistory[
                    nextIndex
                    ],
                )

                return
            }

            const nextIndex =
                Math.max(
                    0,
                    historyIndex - 1,
                )

            setHistoryIndex(
                nextIndex,
            )

            setCommand(
                commandHistory[
                nextIndex
                ],
            )

            return
        }


        /* ----- DESCER ----- */
        if (
            historyIndex ===
            null
        ) {
            return
        }

        const nextIndex =
            historyIndex + 1

        if (
            nextIndex >=
            commandHistory.length
        ) {
            setHistoryIndex(
                null,
            )

            setCommand(
                draftCommand,
            )

            return
        }

        setHistoryIndex(
            nextIndex,
        )

        setCommand(
            commandHistory[
            nextIndex
            ],
        )
    }


    /* === TECLADO === */
    const handleKeyDown = (
        event,
    ) => {
        if (
            event.key ===
            'Enter'
        ) {
            event.preventDefault()

            executeCommand()

            return
        }

        if (
            event.key ===
            'ArrowUp'
        ) {
            event.preventDefault()

            navigateCommandHistory(
                'up',
            )

            return
        }

        if (
            event.key ===
            'ArrowDown'
        ) {
            event.preventDefault()

            navigateCommandHistory(
                'down',
            )
        }
    }


    /* === ALTERAR CAMPO === */
    const handleCommandChange = (
        event,
    ) => {
        setCommand(
            event.target.value,
        )

        if (
            historyIndex !==
            null
        ) {
            setHistoryIndex(
                null,
            )
        }
    }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="terminal-runner">

            {/* === CABEÇALHO === */}
            <header className="terminal-runner-header">
                <div className="terminal-runner-title">
                    <span className="terminal-runner-icon">
                        <TerminalSquare
                            size={17}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <strong>
                            {
                                project.title
                            }
                        </strong>

                        <span>
                            Demo interativa
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="terminal-reset"
                    onClick={
                        resetTerminal
                    }
                    aria-label={
                        `Reiniciar demonstração de ${project.title}`
                    }
                >
                    <RotateCcw
                        size={14}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <span>
                        Reiniciar
                    </span>
                </button>
            </header>


            {/* === TERMINAL === */}
            <div
                className="terminal-demo"
                ref={
                    terminalRef
                }
                onClick={
                    focusInput
                }
            >

                {/* === APRESENTAÇÃO === */}
                {history.length === 0 && (
                    <div className="terminal-welcome">
                        <strong>
                            WS Runner
                        </strong>

                        <span>
                            Demonstração interativa adaptada
                            para o portfólio.
                        </span>

                        <span>
                            Digite{' '}
                            <b>
                                {
                                    initialCommand
                                }
                            </b>{' '}
                            para iniciar ou{' '}
                            <b>
                                help
                            </b>{' '}
                            para ver os comandos disponíveis.
                        </span>

                        <span className="terminal-history-hint">
                            Use ↑ e ↓ para navegar pelos comandos anteriores.
                        </span>
                    </div>
                )}


                {/* === HISTÓRICO === */}
                <div
                    className="terminal-history-list"
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions"
                >
                    {history.map(
                        (
                            item,
                            index,
                        ) => (
                            <div
                                className="terminal-history"
                                key={
                                    `${item.command}-${index}`
                                }
                            >
                                <div className="terminal-line">
                                    <span className="terminal-user">
                                        warlley@ws-os
                                    </span>

                                    <span className="terminal-separator">
                                        :
                                    </span>

                                    <span className="terminal-path">
                                        ~/{project.id}
                                    </span>

                                    <span className="terminal-symbol">
                                        $
                                    </span>

                                    <span>
                                        {
                                            item.command
                                        }
                                    </span>
                                </div>

                                <pre className="terminal-output">
                                    {
                                        item.output
                                    }
                                </pre>
                            </div>
                        ),
                    )}
                </div>


                {/* === ENTRADA === */}
                <div className="terminal-line terminal-current-line">
                    <span className="terminal-user">
                        warlley@ws-os
                    </span>

                    <span className="terminal-separator">
                        :
                    </span>

                    <span className="terminal-path">
                        ~/{project.id}
                    </span>

                    <span className="terminal-symbol">
                        $
                    </span>

                    <input
                        ref={
                            inputRef
                        }
                        className="terminal-input"
                        type="text"
                        value={
                            command
                        }
                        onChange={
                            handleCommandChange
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                        aria-label={
                            `Terminal do projeto ${project.title}`
                        }
                    />
                </div>
            </div>
        </div>
    )
}


export default TerminalDemo