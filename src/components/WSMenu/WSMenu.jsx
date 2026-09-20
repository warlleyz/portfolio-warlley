import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import {
    Code2,
    Search,
} from 'lucide-react'

import {
    searchWS,
} from '../../data/searchData'

import Tooltip from '../Tooltip/Tooltip'

import './WSMenu.css'


function WSMenu({
    apps,
    windows,
    activeAppId,
    onOpenApp,
    onClose,
}) {
    /* === REFERÊNCIAS === */
    const menuRef =
        useRef(null)

    const searchRef =
        useRef(null)


    /* === ESTADO === */
    const [
        search,
        setSearch,
    ] = useState('')

    const searching =
        search.trim().length > 0


    /* === FOCO INICIAL === */
    useEffect(() => {
        const timeout =
            setTimeout(
                () => {
                    searchRef.current?.focus()
                },
                120,
            )

        return () => {
            clearTimeout(
                timeout,
            )
        }
    }, [])


    /* === FECHAR COM ESC === */
    useEffect(() => {
        const handleKeyDown = (
            event,
        ) => {
            if (
                event.key === 'Escape'
            ) {
                onClose()
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
        onClose,
    ])


    /* === FECHAR AO CLICAR FORA === */
    useEffect(() => {
        const handleMouseDown = (
            event,
        ) => {
            if (
                event.target.closest(
                    '.taskbar-menu-button',
                )
            ) {
                return
            }

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target,
                )
            ) {
                onClose()
            }
        }

        document.addEventListener(
            'mousedown',
            handleMouseDown,
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handleMouseDown,
            )
        }
    }, [
        onClose,
    ])


    /* === RESULTADOS === */
    const results =
        useMemo(
            () =>
                searchWS(
                    search,
                ),
            [
                search,
            ],
        )


    /* === ABRIR APLICATIVO === */
    const handleOpenApp = (
        appId,
    ) => {
        onOpenApp(
            appId,
        )

        onClose()
    }


    /* === ABRIR RESULTADO === */
    const handleSearchResult = (
        result,
    ) => {
        if (
            result.type ===
            'external'
        ) {
            window.open(
                result.href,
                '_blank',
                'noopener,noreferrer',
            )

            onClose()

            return
        }

        if (
            result.appId
        ) {
            handleOpenApp(
                result.appId,
            )
        }
    }


    /* === RENDERIZAÇÃO === */
    return (
        <aside
            ref={
                menuRef
            }
            className="ws-menu"
            aria-label="WS Menu"
        >
            <div className="ws-menu-top">
                <div className="ws-menu-heading">
                    <span className="ws-menu-brand">
                        WS
                    </span>

                    <div>
                        <span className="ws-menu-label">
                            WS OS
                        </span>

                        <h2 className="ws-menu-title">
                            {
                                searching
                                    ? 'Pesquisar'
                                    : 'Aplicativos'
                            }
                        </h2>
                    </div>
                </div>


                <div className="ws-menu-search">
                    <Search
                        size={16}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />

                    <input
                        ref={
                            searchRef
                        }
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
                        placeholder="Pesquisar no WS OS"
                        aria-label="Pesquisar no WS OS"
                        autoComplete="off"
                    />
                </div>
            </div>


            <div className="ws-menu-content">
                {
                    searching
                        ? (
                            <SearchResults
                                results={
                                    results
                                }
                                onSelect={
                                    handleSearchResult
                                }
                            />
                        )
                        : (
                            <AppsGrid
                                apps={
                                    apps
                                }
                                windows={
                                    windows
                                }
                                activeAppId={
                                    activeAppId
                                }
                                onOpenApp={
                                    handleOpenApp
                                }
                            />
                        )
                }
            </div>


            <footer className="ws-menu-footer">
                <div className="ws-menu-profile">
                    <span className="ws-menu-avatar">
                        WS
                    </span>

                    <div className="ws-menu-profile-text">
                        <strong>
                            Warlley Silva
                        </strong>

                        <span>
                            Engenharia de Software
                        </span>
                    </div>
                </div>


                <Tooltip
                    text="GitHub"
                    position="top"
                >
                    <a
                        className="ws-menu-github"
                        href="https://github.com/warlleyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Abrir GitHub em nova aba"
                    >
                        <Code2
                            size={17}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />

                        <span>
                            GitHub
                        </span>
                    </a>
                </Tooltip>
            </footer>
        </aside>
    )
}


/* === GRID DE APLICATIVOS === */
function AppsGrid({
    apps,
    windows,
    activeAppId,
    onOpenApp,
}) {
    return (
        <div className="ws-menu-grid">
            {apps.map(
                (app) => {
                    const Icon =
                        app.icon

                    const windowState =
                        windows[
                        app.id
                        ]

                    const isOpen =
                        Boolean(
                            windowState?.open,
                        )

                    const isActive =
                        activeAppId ===
                        app.id

                    const className = [
                        'ws-menu-app',

                        isOpen
                            ? 'ws-menu-app-open'
                            : '',

                        isActive
                            ? 'ws-menu-app-active'
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')

                    return (
                        <button
                            key={
                                app.id
                            }
                            type="button"
                            className={
                                className
                            }
                            onClick={() =>
                                onOpenApp(
                                    app.id,
                                )
                            }
                            aria-label={
                                `Abrir ${app.name}`
                            }
                        >
                            <span className="ws-menu-app-icon">
                                <Icon
                                    size={25}
                                    strokeWidth={1.65}
                                    aria-hidden="true"
                                />

                                {isOpen && (
                                    <span
                                        className="ws-menu-app-state"
                                        aria-hidden="true"
                                    />
                                )}
                            </span>

                            <span className="ws-menu-app-name">
                                {
                                    app.name
                                }
                            </span>
                        </button>
                    )
                },
            )}
        </div>
    )
}


/* === RESULTADOS DA PESQUISA === */
function SearchResults({
    results,
    onSelect,
}) {
    if (
        results.length === 0
    ) {
        return (
            <div className="ws-menu-empty">
                <Search
                    size={24}
                    strokeWidth={1.5}
                    aria-hidden="true"
                />

                <strong>
                    Nenhum resultado
                </strong>

                <span>
                    Tente pesquisar outro termo.
                </span>
            </div>
        )
    }

    return (
        <div className="ws-search-results">
            <span className="ws-search-heading">
                Resultados
            </span>

            <div className="ws-search-list">
                {results.map(
                    (result) => {
                        const Icon =
                            result.icon ??
                            Search

                        return (
                            <button
                                key={
                                    result.id
                                }
                                type="button"
                                className="ws-search-result"
                                onClick={() =>
                                    onSelect(
                                        result,
                                    )
                                }
                                aria-label={
                                    `Abrir ${result.title}`
                                }
                            >
                                <span className="ws-search-result-icon">
                                    <Icon
                                        size={20}
                                        strokeWidth={1.7}
                                        aria-hidden="true"
                                    />
                                </span>

                                <span className="ws-search-result-text">
                                    <strong>
                                        {
                                            result.title
                                        }
                                    </strong>

                                    <span>
                                        {
                                            result.subtitle
                                        }
                                    </span>
                                </span>

                                <span className="ws-search-result-type">
                                    {
                                        result.type ===
                                            'project'
                                            ? 'Projeto'
                                            : result.type ===
                                                'external'
                                                ? 'Web'
                                                : 'App'
                                    }
                                </span>
                            </button>
                        )
                    },
                )}
            </div>
        </div>
    )
}


export default WSMenu