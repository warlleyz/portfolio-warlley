import {
    useEffect,
    useRef,
    useState,
} from 'react'

import './TerminalDemo.css'

function TerminalDemo({ project }) {
    const [command, setCommand] = useState('')
    const [history, setHistory] = useState([])
    const [currentStep, setCurrentStep] = useState('idle')
    const [cart, setCart] = useState([])
    const [temporaryProduct, setTemporaryProduct] = useState({})

    const terminalRef = useRef(null)

    const showHint =
        history.length === 0 &&
        command.length === 0


    useEffect(() => {
        const terminal = terminalRef.current

        if (!terminal) {
            return
        }

        requestAnimationFrame(() => {
            terminal.scrollTop =
                terminal.scrollHeight
        })
    }, [history])

    const demo = project.demo ?? {}

    const addHistory = (typedCommand, output) => {
        setHistory((previous) => [
            ...previous,
            {
                command: typedCommand,
                output,
            },
        ])
    }

    const getCartMenu = () => `=== CARRINHO DE COMPRAS ===

1 - Adicionar produto
2 - Remover produto
3 - Listar produtos
4 - Finalizar compra

Escolha uma opção:`

    const resetTerminal = () => {
        setHistory([])
        setCommand('')
        setCurrentStep('idle')
        setCart([])
        setTemporaryProduct({})
    }

    const executeSimpleCommand = (typedCommand) => {
        if (typedCommand === demo.command) {
            addHistory(
                typedCommand,
                demo.output ?? '',
            )

            return
        }

        addHistory(
            typedCommand,
            `Comando não reconhecido: ${typedCommand}`,
        )
    }

    const executeCartCommand = (typedCommand) => {
        if (currentStep === 'idle') {
            if (typedCommand !== demo.command) {
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

            setCurrentStep('menu')

            return
        }

        if (currentStep === 'menu') {
            switch (typedCommand) {
                case '1':
                    addHistory(
                        typedCommand,
                        'Digite o nome do produto:',
                    )

                    setCurrentStep('product-name')
                    return

                case '2':
                    if (cart.length === 0) {
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

                    setCurrentStep('remove-product')
                    return

                case '3': {
                    if (cart.length === 0) {
                        addHistory(
                            typedCommand,
                            `Carrinho vazio.

${getCartMenu()}`,
                        )

                        return
                    }

                    const products = cart
                        .map(
                            (product, index) =>
                                `${index + 1} - ${product.name} - R$ ${product.price.toFixed(2)}`,
                        )
                        .join('\n')

                    const total = cart.reduce(
                        (sum, product) =>
                            sum + product.price,
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
                    const total = cart.reduce(
                        (sum, product) =>
                            sum + product.price,
                        0,
                    )

                    addHistory(
                        typedCommand,
                        `Compra finalizada.

Total: R$ ${total.toFixed(2)}

Obrigado por utilizar o programa.`,
                    )

                    setCurrentStep('finished')
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

        if (currentStep === 'product-name') {
            setTemporaryProduct({
                name: typedCommand,
            })

            addHistory(
                typedCommand,
                'Digite o preço do produto:',
            )

            setCurrentStep('product-price')

            return
        }

        if (currentStep === 'product-price') {
            const normalizedValue =
                typedCommand.replace(',', '.')

            const price =
                Number(normalizedValue)

            if (
                Number.isNaN(price) ||
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

            setCart((previous) => [
                ...previous,
                product,
            ])

            setTemporaryProduct({})

            addHistory(
                typedCommand,
                `Produto "${product.name}" adicionado com sucesso.

${getCartMenu()}`,
            )

            setCurrentStep('menu')

            return
        }

        if (currentStep === 'remove-product') {
            const productNumber =
                Number(typedCommand)

            const isValidProductNumber =
                Number.isInteger(
                    productNumber,
                ) &&
                productNumber >= 1 &&
                productNumber <=
                cart.length

            if (!isValidProductNumber) {
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

            setCart((previous) =>
                previous.filter(
                    (_, productIndex) =>
                        productIndex !== index,
                ),
            )

            addHistory(
                typedCommand,
                `Produto "${removedProduct.name}" removido.

${getCartMenu()}`,
            )

            setCurrentStep('menu')

            return
        }

        if (currentStep === 'finished') {
            addHistory(
                typedCommand,
                'O programa foi encerrado. Digite clear para reiniciar.',
            )
        }
    }

    const executeCommand = () => {
        const typedCommand =
            command.trim()

        if (!typedCommand) {
            return
        }

        if (typedCommand === 'clear') {
            resetTerminal()
            return
        }

        if (typedCommand === 'help') {
            addHistory(
                typedCommand,
                `Comandos disponíveis:

${demo.command || 'Nenhum comando configurado'}
help
clear`,
            )

            setCommand('')

            return
        }

        if (demo.mode === 'cart') {
            executeCartCommand(
                typedCommand,
            )
        } else {
            executeSimpleCommand(
                typedCommand,
            )
        }

        setCommand('')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            executeCommand()
        }
    }

    return (
        <div
            className="terminal-demo"
            ref={terminalRef}
        >
            
            {showHint && (
                <div className="terminal-hint">
                    Digite <strong>help</strong> para ver os comandos disponíveis.
                </div>
            )}

            {history.map((item, index) => (
                <div
                    className="terminal-history"
                    key={`${item.command}-${index}`}
                >
                    <div className="terminal-line">
                        <span className="terminal-user">
                            warlley@portfolio
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
                            {item.command}
                        </span>
                    </div>

                    <pre className="terminal-output">
                        {item.output}
                    </pre>
                </div>
            ))}

            <div className="terminal-line">
                <span className="terminal-user">
                    warlley@portfolio
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
                    className="terminal-input"
                    type="text"
                    value={command}
                    onChange={(event) =>
                        setCommand(
                            event.target.value,
                        )
                    }
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck="false"
                    aria-label={`Terminal do projeto ${project.title}`}
                />
            </div>
        </div>
    )
}

export default TerminalDemo