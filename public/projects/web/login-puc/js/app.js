const USERS_KEY =
    'login-puc-demo-users'

const SESSION_KEY =
    'login-puc-demo-session'


/* === ARMAZENAMENTO === */
function readStorage(
    storage,
    key,
    fallback,
) {
    try {
        const value =
            storage.getItem(
                key,
            )

        if (
            value === null
        ) {
            return fallback
        }

        return JSON.parse(
            value,
        )
    } catch {
        return fallback
    }
}


function writeStorage(
    storage,
    key,
    value,
) {
    try {
        storage.setItem(
            key,
            JSON.stringify(
                value,
            ),
        )

        return true
    } catch {
        return false
    }
}


function removeStorage(
    storage,
    key,
) {
    try {
        storage.removeItem(
            key,
        )
    } catch {
        // A demo continua mesmo se o armazenamento estiver indisponível.
    }
}


/* === USUÁRIOS === */
function getUsers() {
    const users =
        readStorage(
            localStorage,
            USERS_KEY,
            [],
        )

    return Array.isArray(
        users,
    )
        ? users
        : []
}


function saveUsers(
    users,
) {
    return writeStorage(
        localStorage,
        USERS_KEY,
        users,
    )
}


/* === SESSÃO === */
function getSession() {
    const temporarySession =
        readStorage(
            sessionStorage,
            SESSION_KEY,
            null,
        )

    if (
        temporarySession
    ) {
        return temporarySession
    }

    return readStorage(
        localStorage,
        SESSION_KEY,
        null,
    )
}


function saveSession(
    session,
    remember,
) {
    removeStorage(
        localStorage,
        SESSION_KEY,
    )

    removeStorage(
        sessionStorage,
        SESSION_KEY,
    )

    const storage =
        remember
            ? localStorage
            : sessionStorage

    return writeStorage(
        storage,
        SESSION_KEY,
        session,
    )
}


function clearSession() {
    removeStorage(
        localStorage,
        SESSION_KEY,
    )

    removeStorage(
        sessionStorage,
        SESSION_KEY,
    )
}


/* === MENSAGENS === */
function showMessage(
    message,
    type = 'error',
) {
    const messageElement =
        document.querySelector(
            '#form-message',
        )

    if (
        !messageElement
    ) {
        return
    }

    messageElement.textContent =
        message

    messageElement.className =
        `form-message form-message-${type}`
}


/* === CRIPTOGRAFIA DA DEMO === */
function bytesToHex(
    bytes,
) {
    return Array
        .from(
            bytes,
        )
        .map(
            (
                byte,
            ) =>
                byte
                    .toString(16)
                    .padStart(
                        2,
                        '0',
                    ),
        )
        .join('')
}


function createSalt() {
    const bytes =
        new Uint8Array(16)

    crypto.getRandomValues(
        bytes,
    )

    return bytesToHex(
        bytes,
    )
}


async function hashPassword(
    password,
    salt,
) {
    const encoder =
        new TextEncoder()

    const data =
        encoder.encode(
            `${salt}:${password}`,
        )

    const digest =
        await crypto.subtle.digest(
            'SHA-256',
            data,
        )

    return bytesToHex(
        new Uint8Array(
            digest,
        ),
    )
}


/* === VALIDAR SENHA === */
async function passwordMatches(
    user,
    password,
) {
    if (
        user.passwordHash &&
        user.passwordSalt
    ) {
        const hash =
            await hashPassword(
                password,
                user.passwordSalt,
            )

        return (
            hash ===
            user.passwordHash
        )
    }

    /*
     * Compatibilidade temporária com contas
     * criadas pela versão antiga da demo.
     */
    return (
        typeof user.password ===
        'string' &&
        user.password ===
        password
    )
}


/* === MIGRAR CONTA ANTIGA === */
async function migrateLegacyPassword(
    user,
    password,
) {
    if (
        !user.password ||
        user.passwordHash
    ) {
        return
    }

    const users =
        getUsers()

    const userIndex =
        users.findIndex(
            (
                currentUser,
            ) =>
                currentUser.username
                    .toLowerCase() ===
                user.username
                    .toLowerCase(),
        )

    if (
        userIndex === -1
    ) {
        return
    }

    const salt =
        createSalt()

    const passwordHash =
        await hashPassword(
            password,
            salt,
        )

    const migratedUser = {
        ...users[userIndex],

        passwordSalt:
            salt,

        passwordHash,
    }

    delete migratedUser.password

    users[userIndex] =
        migratedUser

    saveUsers(
        users,
    )
}


/* === CADASTRO === */
const registerForm =
    document.querySelector(
        '#register-form',
    )

if (
    registerForm
) {
    registerForm.addEventListener(
        'submit',
        async (
            event,
        ) => {
            event.preventDefault()

            const name =
                document
                    .querySelector(
                        '#name',
                    )
                    .value
                    .trim()

            const username =
                document
                    .querySelector(
                        '#username',
                    )
                    .value
                    .trim()

            const email =
                document
                    .querySelector(
                        '#email',
                    )
                    .value
                    .trim()
                    .toLowerCase()

            const password =
                document
                    .querySelector(
                        '#password',
                    )
                    .value

            const confirmPassword =
                document
                    .querySelector(
                        '#confirmPassword',
                    )
                    .value

            if (
                !name ||
                !username ||
                !email ||
                !password ||
                !confirmPassword
            ) {
                showMessage(
                    'Preencha todos os campos.',
                )

                return
            }

            if (
                password.length < 4
            ) {
                showMessage(
                    'A senha deve possuir pelo menos 4 caracteres.',
                )

                return
            }

            if (
                password !==
                confirmPassword
            ) {
                showMessage(
                    'As senhas não coincidem.',
                )

                return
            }

            const users =
                getUsers()

            const normalizedUsername =
                username
                    .toLowerCase()

            const userExists =
                users.some(
                    (
                        user,
                    ) =>
                        user.username
                            ?.toLowerCase() ===
                        normalizedUsername ||
                        user.email
                            ?.toLowerCase() ===
                        email,
                )

            if (
                userExists
            ) {
                showMessage(
                    'Usuário ou e-mail já cadastrado.',
                )

                return
            }

            try {
                const passwordSalt =
                    createSalt()

                const passwordHash =
                    await hashPassword(
                        password,
                        passwordSalt,
                    )

                users.push({
                    name,
                    username,
                    email,
                    passwordSalt,
                    passwordHash,
                })

                const saved =
                    saveUsers(
                        users,
                    )

                if (
                    !saved
                ) {
                    showMessage(
                        'Não foi possível salvar a conta neste navegador.',
                    )

                    return
                }

                showMessage(
                    'Cadastro realizado com sucesso!',
                    'success',
                )

                registerForm.reset()

                setTimeout(
                    () => {
                        window.location.href =
                            './index.html'
                    },
                    1000,
                )
            } catch {
                showMessage(
                    'Não foi possível processar o cadastro.',
                )
            }
        },
    )
}


/* === LOGIN === */
const loginForm =
    document.querySelector(
        '#login-form',
    )

if (
    loginForm
) {
    loginForm.addEventListener(
        'submit',
        async (
            event,
        ) => {
            event.preventDefault()

            const login =
                document
                    .querySelector(
                        '#username',
                    )
                    .value
                    .trim()
                    .toLowerCase()

            const password =
                document
                    .querySelector(
                        '#password',
                    )
                    .value

            const remember =
                Boolean(
                    document
                        .querySelector(
                            '#remember-me',
                        )
                        ?.checked,
                )

            if (
                !login ||
                !password
            ) {
                showMessage(
                    'Informe seu usuário/e-mail e senha.',
                )

                return
            }

            const users =
                getUsers()

            const user =
                users.find(
                    (
                        item,
                    ) =>
                        item.username
                            ?.toLowerCase() ===
                        login ||
                        item.email
                            ?.toLowerCase() ===
                        login,
                )

            if (
                !user
            ) {
                showMessage(
                    'Usuário ou senha inválidos.',
                )

                return
            }

            try {
                const validPassword =
                    await passwordMatches(
                        user,
                        password,
                    )

                if (
                    !validPassword
                ) {
                    showMessage(
                        'Usuário ou senha inválidos.',
                    )

                    return
                }

                await migrateLegacyPassword(
                    user,
                    password,
                )

                const sessionSaved =
                    saveSession(
                        {
                            name:
                                user.name,

                            username:
                                user.username,
                        },
                        remember,
                    )

                if (
                    !sessionSaved
                ) {
                    showMessage(
                        'Não foi possível iniciar a sessão.',
                    )

                    return
                }

                showMessage(
                    `Bem-vindo, ${user.name}!`,
                    'success',
                )

                setTimeout(
                    () => {
                        window.location.href =
                            './home.html'
                    },
                    700,
                )
            } catch {
                showMessage(
                    'Não foi possível validar o login.',
                )
            }
        },
    )
}


/* === REDEFINIR DEMO === */
const resetDemoButton =
    document.querySelector(
        '#reset-demo-button',
    )

if (
    resetDemoButton
) {
    resetDemoButton.addEventListener(
        'click',
        () => {
            const confirmed =
                window.confirm(
                    'Deseja remover as contas e sessões salvas nesta demonstração?',
                )

            if (
                !confirmed
            ) {
                return
            }

            removeStorage(
                localStorage,
                USERS_KEY,
            )

            clearSession()

            loginForm?.reset()

            showMessage(
                'Dados da demonstração removidos.',
                'success',
            )
        },
    )
}


/* === ÁREA LOGADA === */
const loggedUser =
    document.querySelector(
        '#logged-user',
    )

if (
    loggedUser
) {
    const session =
        getSession()

    if (
        !session?.name
    ) {
        window.location.replace(
            './index.html',
        )
    } else {
        loggedUser.textContent =
            session.name
    }
}


/* === LOGOUT === */
const logoutButton =
    document.querySelector(
        '#logout-button',
    )

if (
    logoutButton
) {
    logoutButton.addEventListener(
        'click',
        () => {
            clearSession()

            window.location.replace(
                './index.html',
            )
        },
    )
}