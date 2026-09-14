const USERS_KEY = 'login-puc-demo-users'
const SESSION_KEY = 'login-puc-demo-session'

function getUsers() {
    return JSON.parse(
        localStorage.getItem(USERS_KEY) || '[]',
    )
}

function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users),
    )
}

function showMessage(message, type = 'error') {
    const messageElement =
        document.querySelector('#form-message')

    if (!messageElement) {
        return
    }

    messageElement.textContent = message
    messageElement.className =
        `form-message form-message-${type}`
}

/* === CADASTRO === */

const registerForm =
    document.querySelector('#register-form')

if (registerForm) {
    registerForm.addEventListener(
        'submit',
        (event) => {
            event.preventDefault()

            const name =
                document.querySelector('#name')
                    .value
                    .trim()

            const username =
                document.querySelector('#username')
                    .value
                    .trim()

            const email =
                document.querySelector('#email')
                    .value
                    .trim()
                    .toLowerCase()

            const password =
                document.querySelector('#password')
                    .value

            const confirmPassword =
                document.querySelector(
                    '#confirmPassword',
                ).value

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

            if (password.length < 4) {
                showMessage(
                    'A senha deve possuir pelo menos 4 caracteres.',
                )

                return
            }

            if (password !== confirmPassword) {
                showMessage(
                    'As senhas não coincidem.',
                )

                return
            }

            const users = getUsers()

            const userExists = users.some(
                (user) =>
                    user.username.toLowerCase() ===
                    username.toLowerCase() ||
                    user.email === email,
            )

            if (userExists) {
                showMessage(
                    'Usuário ou e-mail já cadastrado.',
                )

                return
            }

            users.push({
                name,
                username,
                email,
                password,
            })

            saveUsers(users)

            showMessage(
                'Cadastro realizado com sucesso!',
                'success',
            )

            registerForm.reset()

            setTimeout(() => {
                window.location.href =
                    './index.html'
            }, 1000)
        },
    )
}

/* === LOGIN === */

const loginForm =
    document.querySelector('#login-form')

if (loginForm) {
    loginForm.addEventListener(
        'submit',
        (event) => {
            event.preventDefault()

            const login =
                document.querySelector('#username')
                    .value
                    .trim()
                    .toLowerCase()

            const password =
                document.querySelector('#password')
                    .value

            if (!login || !password) {
                showMessage(
                    'Informe seu usuário/e-mail e senha.',
                )

                return
            }

            const users = getUsers()

            const user = users.find(
                (item) =>
                    (
                        item.username.toLowerCase() ===
                        login ||
                        item.email === login
                    ) &&
                    item.password === password,
            )

            if (!user) {
                showMessage(
                    'Usuário ou senha inválidos.',
                )

                return
            }

            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify({
                    name: user.name,
                    username: user.username,
                }),
            )

            showMessage(
                `Bem-vindo, ${user.name}!`,
                'success',
            )

            setTimeout(() => {
                window.location.href =
                    './home.html'
            }, 700)
        },
    )
}

/* === ÁREA LOGADA === */

const loggedUser =
    document.querySelector('#logged-user')

if (loggedUser) {
    const session = JSON.parse(
        localStorage.getItem(SESSION_KEY) ||
        'null',
    )

    if (!session) {
        window.location.href =
            './index.html'
    } else {
        loggedUser.textContent =
            session.name
    }
}

const logoutButton =
    document.querySelector('#logout-button')

if (logoutButton) {
    logoutButton.addEventListener(
        'click',
        () => {
            localStorage.removeItem(
                SESSION_KEY,
            )

            window.location.href =
                './index.html'
        },
    )
}