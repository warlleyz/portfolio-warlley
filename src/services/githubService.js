/* === CONFIGURAÇÃO === */
const GITHUB_USERNAME =
    'warlleyz'

const GITHUB_API =
    'https://api.github.com'


/* === BUSCAR REPOSITÓRIOS === */
async function getGithubRepositories() {
    const response =
        await fetch(
            `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`,
        )

    if (!response.ok) {
        throw new Error(
            'Não foi possível carregar os repositórios do GitHub.',
        )
    }

    const repositories =
        await response.json()

    return repositories
        .filter(
            (repository) =>
                !repository.fork &&
                !repository.archived,
        )
        .map(
            (repository) => ({
                id:
                    repository.id,

                name:
                    repository.name,

                fullName:
                    repository.full_name,

                description:
                    repository.description,

                github:
                    repository.html_url,

                homepage:
                    repository.homepage,

                language:
                    repository.language,

                stars:
                    repository.stargazers_count,

                forks:
                    repository.forks_count,

                topics:
                    repository.topics ?? [],

                createdAt:
                    repository.created_at,

                updatedAt:
                    repository.updated_at,

                pushedAt:
                    repository.pushed_at,
            }),
        )
}


export {
    getGithubRepositories,
}