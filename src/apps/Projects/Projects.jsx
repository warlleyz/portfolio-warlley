import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FolderGit2,
  GitBranch,
  GitFork,
  Image,
  Info,
  MonitorPlay,
  Play,
  Search,
  Star,
  X,
} from 'lucide-react'

import projectsData, {
  hiddenGithubRepositories,
} from '../../data/projectsData'

import {
  getGithubRepositories,
} from '../../services/githubService'

import './Projects.css'


/* === NORMALIZAR TEXTO === */
function normalizeText(
  value = '',
) {
  return String(value)
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase()
    .trim()
}


/* === FORMATAR DATA === */
function formatDate(
  value,
) {
  if (
    !value
  ) {
    return null
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
    {
      day:
        '2-digit',

      month:
        '2-digit',

      year:
        'numeric',
    },
  ).format(
    date,
  )
}


/* === AÇÃO DO PROJETO === */
function getProjectAction(
  project,
) {
  switch (
    project.demoType
  ) {
    case 'terminal':
      return {
        label:
          'Executar',

        icon:
          Play,
      }

    case 'web':
      return {
        label:
          'Abrir app',

        icon:
          MonitorPlay,
      }

    case 'media':
      return {
        label:
          'Ver demonstração',

        icon:
          Image,
      }

    case 'details':
    default:
      return {
        label:
          'Ver detalhes',

        icon:
          Info,
      }
  }
}


function Projects({
  onOpenProject,
}) {

  /* === ESTADO === */
  const [
    githubRepositories,
    setGithubRepositories,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    githubError,
    setGithubError,
  ] = useState(false)

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState('Todos')


  /* === CARREGAR GITHUB === */
  useEffect(() => {
    let active =
      true

    const loadRepositories =
      async () => {
        try {
          const repositories =
            await getGithubRepositories()

          if (
            !active
          ) {
            return
          }

          setGithubRepositories(
            repositories,
          )

          setGithubError(
            false,
          )
        } catch (error) {
          if (
            !active
          ) {
            return
          }

          console.error(
            'Erro ao carregar repositórios:',
            error,
          )

          setGithubError(
            true,
          )
        } finally {
          if (
            active
          ) {
            setLoading(
              false,
            )
          }
        }
      }

    loadRepositories()

    return () => {
      active =
        false
    }
  }, [])


  /* === PROJETOS CONFIGURADOS === */
  const configuredProjects =
    useMemo(
      () =>
        projectsData.map(
          (
            project,
          ) => {
            const repository =
              githubRepositories.find(
                (
                  githubRepository,
                ) =>
                  githubRepository.name
                    .toLowerCase() ===
                  project.repository
                    .toLowerCase(),
              )

            return {
              ...project,

              description:
                repository?.description ??
                project.description ??
                'Projeto disponível no GitHub.',

              github:
                repository?.github ??
                `https://github.com/warlleyz/${project.repository}`,

              language:
                repository?.language ??
                null,

              stars:
                repository?.stars ??
                0,

              forks:
                repository?.forks ??
                0,

              topics:
                repository?.topics ??
                [],

              homepage:
                repository?.homepage ??
                null,

              updatedAt:
                repository?.updatedAt ??
                null,

              pushedAt:
                repository?.pushedAt ??
                null,

              configured:
                true,

              githubLoaded:
                Boolean(
                  repository,
                ),
            }
          },
        ),
      [
        githubRepositories,
      ],
    )


  /* === REPOSITÓRIOS EXTRAS === */
  const extraRepositories =
    useMemo(
      () => {
        const configuredNames =
          new Set(
            projectsData.map(
              (
                project,
              ) =>
                project.repository
                  .toLowerCase(),
            ),
          )

        const hiddenNames =
          new Set(
            hiddenGithubRepositories.map(
              (
                repository,
              ) =>
                repository
                  .toLowerCase(),
            ),
          )

        return githubRepositories
          .filter(
            (
              repository,
            ) => {
              const repositoryName =
                repository.name
                  .toLowerCase()

              return (
                !configuredNames.has(
                  repositoryName,
                ) &&
                !hiddenNames.has(
                  repositoryName,
                )
              )
            },
          )
          .map(
            (
              repository,
            ) => {
              const technologies =
                [
                  repository.language,

                  ...(
                    repository.topics ??
                    []
                  ),
                ]
                  .filter(Boolean)
                  .filter(
                    (
                      value,
                      index,
                      array,
                    ) =>
                      array.indexOf(
                        value,
                      ) ===
                      index,
                  )

              return {
                id:
                  `github-${repository.id}`,

                repository:
                  repository.name,

                title:
                  repository.name,

                description:
                  repository.description ??
                  'Repositório público disponível no GitHub.',

                github:
                  repository.github,

                homepage:
                  repository.homepage,

                language:
                  repository.language,

                stars:
                  repository.stars,

                forks:
                  repository.forks,

                topics:
                  repository.topics ??
                  [],

                updatedAt:
                  repository.updatedAt,

                pushedAt:
                  repository.pushedAt,

                technologies,

                icon:
                  FolderGit2,

                demoType:
                  'details',

                details: {
                  features: [
                    'Repositório público sincronizado automaticamente com o GitHub.',
                  ],

                  link:
                    repository.homepage ??
                    null,
                },

                configured:
                  false,

                githubLoaded:
                  true,
              }
            },
          )
      },
      [
        githubRepositories,
      ],
    )


  /* === TODOS OS PROJETOS === */
  const projects =
    useMemo(
      () => [
        ...configuredProjects,
        ...extraRepositories,
      ],
      [
        configuredProjects,
        extraRepositories,
      ],
    )


  /* === FILTROS === */
  const filters =
    useMemo(
      () => {
        const values =
          new Set()

        projects.forEach(
          (
            project,
          ) => {
            if (
              project.language
            ) {
              values.add(
                project.language,
              )
            }

            project.technologies
              ?.forEach(
                (
                  technology,
                ) => {
                  if (
                    technology
                  ) {
                    values.add(
                      technology,
                    )
                  }
                },
              )
          },
        )

        return [
          'Todos',

          ...Array
            .from(values)
            .sort(
              (
                first,
                second,
              ) =>
                first.localeCompare(
                  second,
                  'pt-BR',
                ),
            ),
        ]
      },
      [
        projects,
      ],
    )


  /* === PROJETOS FILTRADOS === */
  const filteredProjects =
    useMemo(
      () => {
        const normalizedSearch =
          normalizeText(
            search,
          )

        return projects.filter(
          (
            project,
          ) => {
            const matchesFilter =
              selectedFilter ===
                'Todos' ||
              project.language ===
                selectedFilter ||
              project.technologies
                ?.includes(
                  selectedFilter,
                )

            if (
              !matchesFilter
            ) {
              return false
            }

            if (
              !normalizedSearch
            ) {
              return true
            }

            const searchableContent =
              [
                project.title,
                project.repository,
                project.description,
                project.language,

                ...(
                  project.technologies ??
                  []
                ),

                ...(
                  project.topics ??
                  []
                ),
              ]
                .filter(Boolean)
                .join(' ')

            return normalizeText(
              searchableContent,
            ).includes(
              normalizedSearch,
            )
          },
        )
      },
      [
        projects,
        search,
        selectedFilter,
      ],
    )


  /* === ABRIR GITHUB === */
  const openGithub = (
    url,
  ) => {
    if (
      !url
    ) {
      return
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer',
    )
  }


  /* === LIMPAR FILTROS === */
  const clearFilters =
    () => {
      setSearch(
        '',
      )

      setSelectedFilter(
        'Todos',
      )
    }


  /* === RENDERIZAÇÃO === */
  return (
    <div className="projects">

      {/* === CABEÇALHO === */}
      <section className="projects-header">
        <div>
          <span className="projects-label">
            Portfólio
          </span>

          <h1>
            Meus projetos
          </h1>

          <p>
            Projetos acadêmicos, pessoais
            e repositórios públicos sincronizados
            com o GitHub.
          </p>
        </div>

        <div
          className="projects-header-status"
          aria-live="polite"
        >
          {loading && (
            <span className="projects-github-status">
              Sincronizando GitHub...
            </span>
          )}

          {!loading &&
            githubError && (
              <span className="projects-github-status projects-github-status-error">
                Dados locais
              </span>
            )}

          {!loading &&
            !githubError && (
              <span className="projects-github-status projects-github-status-success">
                GitHub sincronizado
              </span>
            )}

          <span className="projects-count">
            {
              filteredProjects.length
            }{' '}

            {
              filteredProjects.length === 1
                ? 'projeto'
                : 'projetos'
            }
          </span>
        </div>
      </section>


      {/* === BUSCA E FILTROS === */}
      <section className="projects-tools">

        {/* ----- BUSCA ----- */}
        <div className="projects-search">
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
            placeholder="Buscar projetos..."
            aria-label="Buscar projetos"
            autoComplete="off"
          />

          {search && (
            <button
              type="button"
              className="projects-search-clear"
              onClick={() =>
                setSearch(
                  '',
                )
              }
              aria-label="Limpar busca"
              title="Limpar busca"
            >
              <X
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          )}
        </div>


        {/* ----- FILTROS ----- */}
        <div
          className="projects-filters"
          aria-label="Filtrar projetos por tecnologia"
        >
          {filters.map(
            (
              filter,
            ) => {
              const isSelected =
                selectedFilter ===
                filter

              return (
                <button
                  key={
                    filter
                  }
                  type="button"
                  className={[
                    'projects-filter',

                    isSelected
                      ? 'projects-filter-active'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() =>
                    setSelectedFilter(
                      filter,
                    )
                  }
                  aria-pressed={
                    isSelected
                  }
                >
                  {
                    filter
                  }
                </button>
              )
            },
          )}
        </div>
      </section>


      {/* === PROJETOS === */}
      {
        filteredProjects.length > 0
          ? (
              <div className="projects-grid">
                {filteredProjects.map(
                  (
                    project,
                  ) => {
                    const Icon =
                      project.icon ??
                      FolderGit2

                    const updatedDate =
                      formatDate(
                        project.pushedAt ??
                        project.updatedAt,
                      )

                    const projectAction =
                      getProjectAction(
                        project,
                      )

                    const ActionIcon =
                      projectAction.icon

                    return (
                      <article
                        key={
                          project.id
                        }
                        className="project-card"
                      >

                        {/* === TOPO === */}
                        <div className="project-card-top">
                          <div className="project-icon">
                            <Icon
                              size={22}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          </div>

                          <div className="project-card-badges">
                            <span
                              className={[
                                'project-status',

                                project.configured
                                  ? 'project-status-demo'
                                  : 'project-status-github',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {
                                project.configured
                                  ? 'Demo disponível'
                                  : 'Somente GitHub'
                              }
                            </span>

                            {project.language && (
                              <span className="project-language">
                                {
                                  project.language
                                }
                              </span>
                            )}
                          </div>
                        </div>


                        {/* === CONTEÚDO === */}
                        <div className="project-content">
                          <h2>
                            {
                              project.title
                            }
                          </h2>

                          <p>
                            {
                              project.description
                            }
                          </p>
                        </div>


                        {/* === TECNOLOGIAS === */}
                        {project.technologies
                          ?.length > 0 && (
                            <div className="project-technologies">
                              {project.technologies.map(
                                (
                                  technology,
                                ) => (
                                  <span
                                    key={
                                      technology
                                    }
                                  >
                                    {
                                      technology
                                    }
                                  </span>
                                ),
                              )}
                            </div>
                          )}


                        {/* === DADOS DO GITHUB === */}
                        <div className="project-meta">
                          <span>
                            <Star
                              size={13}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />

                            {
                              project.stars
                            }
                          </span>

                          <span>
                            <GitFork
                              size={13}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />

                            {
                              project.forks
                            }
                          </span>

                          {updatedDate && (
                            <span className="project-updated">
                              Atualizado em{' '}
                              {
                                updatedDate
                              }
                            </span>
                          )}
                        </div>


                        {/* === AÇÕES === */}
                        <div className="project-actions">
                          <button
                            type="button"
                            className="project-button project-button-secondary"
                            onClick={() =>
                              openGithub(
                                project.github,
                              )
                            }
                            aria-label={
                              `Abrir ${project.title} no GitHub`
                            }
                          >
                            <GitBranch
                              size={15}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />

                            GitHub
                          </button>

                          <button
                            type="button"
                            className="project-button project-button-primary"
                            onClick={() =>
                              onOpenProject?.(
                                project,
                              )
                            }
                            aria-label={
                              `${projectAction.label}: ${project.title}`
                            }
                          >
                            <ActionIcon
                              size={15}
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />

                            {
                              projectAction.label
                            }
                          </button>
                        </div>
                      </article>
                    )
                  },
                )}
              </div>
            )
          : (
              <div className="projects-empty">
                <Search
                  size={22}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <strong>
                  Nenhum projeto encontrado
                </strong>

                <p>
                  Tente outro termo ou selecione
                  um filtro diferente.
                </p>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                >
                  Limpar filtros
                </button>
              </div>
            )
      }
    </div>
  )
}


export default Projects