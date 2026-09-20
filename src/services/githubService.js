/* === CONFIGURAÇÃO === */
const GITHUB_USERNAME =
    'warlleyz'

const GITHUB_API =
    'https://api.github.com'

const CACHE_DURATION =
    5 * 60 * 1000


/* === CACHE === */
const cache = {
    profile: {
        data:
            null,

        timestamp:
            0,

        request:
            null,
    },

    repositories: {
        data:
            null,

        timestamp:
            0,

        request:
            null,
    },
}


/* === VERIFICAR CACHE === */
function isCacheValid(
    entry,
) {
    return (
        entry.data !== null &&
        Date.now() -
        entry.timestamp <
        CACHE_DURATION
    )
}


/* === REQUISIÇÃO === */
async function requestGithub(
    endpoint,
) {
    let response

    try {
        response =
            await fetch(
                `${GITHUB_API}${endpoint}`,
                {
                    headers: {
                        Accept:
                            'application/vnd.github+json',
                    },
                },
            )
    } catch {
        throw new Error(
            'Não foi possível conectar ao GitHub.',
        )
    }

    if (
        !response.ok
    ) {
        throw new Error(
            `Não foi possível carregar os dados do GitHub. Status: ${response.status}.`,
        )
    }

    return response.json()
}


/* === PERFIL === */
async function getGithubProfile() {
    const entry =
        cache.profile

    if (
        isCacheValid(
            entry,
        )
    ) {
        return entry.data
    }

    if (
        entry.request
    ) {
        return entry.request
    }

    entry.request =
        requestGithub(
            `/users/${GITHUB_USERNAME}`,
        )
            .then(
                (
                    profile,
                ) => {
                    const normalizedProfile = {
                        id:
                            profile.id,

                        login:
                            profile.login,

                        name:
                            profile.name,

                        avatar:
                            profile.avatar_url,

                        github:
                            profile.html_url,

                        bio:
                            profile.bio,

                        location:
                            profile.location,

                        company:
                            profile.company,

                        blog:
                            profile.blog,

                        publicRepos:
                            profile.public_repos ??
                            0,

                        followers:
                            profile.followers ??
                            0,

                        following:
                            profile.following ??
                            0,

                        createdAt:
                            profile.created_at,

                        updatedAt:
                            profile.updated_at,
                    }

                    entry.data =
                        normalizedProfile

                    entry.timestamp =
                        Date.now()

                    return normalizedProfile
                },
            )
            .finally(
                () => {
                    entry.request =
                        null
                },
            )

    return entry.request
}


/* === REPOSITÓRIOS === */
async function getGithubRepositories() {
    const entry =
        cache.repositories

    if (
        isCacheValid(
            entry,
        )
    ) {
        return entry.data
    }

    if (
        entry.request
    ) {
        return entry.request
    }

    entry.request =
        requestGithub(
            `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`,
        )
            .then(
                (
                    repositories,
                ) => {
                    const normalizedRepositories =
                        Array.isArray(
                            repositories,
                        )
                            ? repositories
                                .filter(
                                    (
                                        repository,
                                    ) =>
                                        !repository.fork &&
                                        !repository.archived,
                                )
                                .map(
                                    (
                                        repository,
                                    ) => ({
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
                                            repository.topics ??
                                            [],

                                        createdAt:
                                            repository.created_at,

                                        updatedAt:
                                            repository.updated_at,

                                        pushedAt:
                                            repository.pushed_at,
                                    }),
                                )
                            : []

                    entry.data =
                        normalizedRepositories

                    entry.timestamp =
                        Date.now()

                    return normalizedRepositories
                },
            )
            .finally(
                () => {
                    entry.request =
                        null
                },
            )

    return entry.request
}


/* === DADOS COMPLETOS === */
async function getGithubData() {
    const [
        profile,
        repositories,
    ] =
        await Promise.all([
            getGithubProfile(),
            getGithubRepositories(),
        ])

    return {
        profile,
        repositories,
    }
}


/* === LIMPAR CACHE === */
function clearGithubCache() {
    cache.profile.data =
        null

    cache.profile.timestamp =
        0

    cache.repositories.data =
        null

    cache.repositories.timestamp =
        0
}


export {
    clearGithubCache,
    getGithubData,
    getGithubProfile,
    getGithubRepositories,
}