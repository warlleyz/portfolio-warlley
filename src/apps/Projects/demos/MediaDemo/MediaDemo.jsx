import './MediaDemo.css'

function MediaDemo({ project }) {
    const video = project.demo?.video
    const images = project.demo?.images ?? []

    const hasMedia =
        Boolean(video) ||
        images.length > 0

    if (!hasMedia) {
        return (
            <div className="media-demo media-demo-empty">
                <h2>{project.title}</h2>

                <p>
                    Demonstração em mídia ainda não configurada.
                </p>
            </div>
        )
    }

    return (
        <div className="media-demo">
            {video && (
                <video
                    className="media-demo-video"
                    controls
                    preload="metadata"
                >
                    <source src={video} />

                    Seu navegador não suporta reprodução de vídeo.
                </video>
            )}

            {images.length > 0 && (
                <div className="media-demo-gallery">
                    {images.map((image, index) => (
                        <img
                            key={image}
                            className="media-demo-image"
                            src={image}
                            alt={`${project.title} - imagem ${index + 1}`}
                            loading="lazy"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MediaDemo