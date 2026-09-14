import './Desktop.css'

function Desktop() {
    return (
        <main className="desktop">
            <section className="desktop-shortcuts">
                <div className="shortcut">Sobre mim</div>
                <div className="shortcut">Projetos</div>
                <div className="shortcut">Tecnologias</div>
                <div className="shortcut">Contato</div>
                <div className="shortcut">Currículo</div>
                <div className="shortcut">Terminal</div>
            </section>

            <div className="taskbar-placeholder">
                Barra de tarefas
            </div>
        </main>
    )
}

export default Desktop