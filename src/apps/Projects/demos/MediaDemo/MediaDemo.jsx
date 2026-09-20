import {
    Image as ImageIcon,
    Images,
    Video,
} from 'lucide-react'

import './MediaDemo.css'


function MediaDemo({
    project,
}) {
    
    /* === DADOS === */
    const video =
        project.demo?.video

    const images =
        project.demo?.images ??
        []

    const hasMedia =
        Boolean(
            video,
        ) ||
        images.length > 0


    /* === ABRIR IMAGEM === */
    const openImage = (
        image,
    ) => {
        if (
            !image
        ) {
            return
        }

        window.open(
            image,
            '_blank',
            'noopener,noreferrer',
        )
    }


    /* === SEM DEMONSTRAÇÃO === */
    if (
        !hasMedia
    ) {
        return (
            <div className="media-demo media-demo-empty">
                <div className="media-demo-empty-icon">
                    <Images
                        size={22}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <h2>
                        {
                            project.title
                        }
                    </h2>

                    <p>
                        Demonstração em mídia ainda não configurada.
                    </p>
                </div>
            </div>
        )
    }


    /* === RENDERIZAÇÃO === */
    return (
        <div className="media-demo">

            {/* === CABEÇALHO === */}
            <header className="media-demo-header">
                <div className="media-demo-title">
                    <span className="media-demo-icon">
                        <Images
                            size={17}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <strong>
                            {
                                project.title
                            }
                        </strong>

                        <span>
                            Demonstração visual
                        </span>
                    </div>
                </div>


                <div className="media-demo-status">
                    {video && (
                        <span>
                            <Video
                                size={12}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            Vídeo
                        </span>
                    )}

                    {images.length > 0 && (
                        <span>
                            <ImageIcon
                                size={12}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            {
                                images.length
                            }{' '}

                            {
                                images.length === 1
                                    ? 'imagem'
                                    : 'imagens'
                            }
                        </span>
                    )}
                </div>
            </header>


            {/* === CONTEÚDO === */}
            <div className="media-demo-content">

                {/* ----- VÍDEO ----- */}
                {video && (
                    <section className="media-demo-section">
                        <div className="media-demo-section-header">
                            <Video
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            <span>
                                Demonstração
                            </span>
                        </div>

                        <div className="media-demo-video-wrapper">
                            <video
                                className="media-demo-video"
                                controls
                                preload="metadata"
                                aria-label={
                                    `Vídeo de demonstração de ${project.title}`
                                }
                            >
                                <source
                                    src={
                                        video
                                    }
                                    type="video/mp4"
                                />

                                Seu navegador não suporta reprodução de vídeo.
                            </video>
                        </div>
                    </section>
                )}


                {/* ----- GALERIA ----- */}
                {images.length > 0 && (
                    <section className="media-demo-section">
                        <div className="media-demo-section-header">
                            <ImageIcon
                                size={14}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />

                            <span>
                                Capturas do projeto
                            </span>
                        </div>

                        <div className="media-demo-gallery">
                            {images.map(
                                (
                                    image,
                                    index,
                                ) => (
                                    <button
                                        key={
                                            image
                                        }
                                        type="button"
                                        className="media-demo-image-button"
                                        onClick={() =>
                                            openImage(
                                                image,
                                            )
                                        }
                                        aria-label={
                                            `Abrir captura ${index + 1} de ${project.title} em nova aba`
                                        }
                                    >
                                        <img
                                            className="media-demo-image"
                                            src={
                                                image
                                            }
                                            alt={
                                                `${project.title} - captura ${index + 1}`
                                            }
                                            loading="lazy"
                                        />
                                    </button>
                                ),
                            )}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}


export default MediaDemo