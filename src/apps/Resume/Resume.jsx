import {
    Download,
    FileText,
} from 'lucide-react'

import './Resume.css'

function Resume() {
    const resumeUrl =
        `${import.meta.env.BASE_URL}files/curriculo-warlley.pdf`

    return (
        <div className="resume">
            <div className="resume-header">
                <span className="resume-label">
                    Currículo
                </span>

                <h1>
                    Currículo profissional
                </h1>

                <p>
                    Visualize meu currículo diretamente abaixo.
                </p>
            </div>

            <div className="resume-viewer">
                <div className="resume-placeholder">
                    <div className="resume-icon">
                        <FileText
                            size={34}
                            strokeWidth={1.8}
                        />
                    </div>

                    <strong>
                        Currículo ainda não disponível
                    </strong>

                    <p>
                        O arquivo PDF será adicionado em breve.
                    </p>
                </div>
            </div>

            <a
                className="resume-button"
                href={resumeUrl}
                download
                aria-disabled="true"
                onClick={(event) =>
                    event.preventDefault()
                }
            >
                <Download
                    size={17}
                    strokeWidth={1.8}
                />

                Baixar currículo
            </a>
        </div>
    )
}

export default Resume