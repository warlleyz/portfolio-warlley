import './WebDemo.css'

function WebDemo({ project }) {
    const demoUrl = project.demo?.url

    if (!demoUrl) {
        return (
            <div className="web-demo web-demo-empty">
                <h2>{project.title}</h2>

                <p>
                    Demonstração web ainda não configurada.
                </p>
            </div>
        )
    }

    return (
        <div className="web-demo">
            <iframe
                className="web-demo-frame"
                src={demoUrl}
                title={`Demonstração de ${project.title}`}
            />
        </div>
    )
}

export default WebDemo