import {
    Download,
    ExternalLink,
    FileText,
} from 'lucide-react'

import './Resume.css'


function Resume() {
    const resumeUrl =
        `${import.meta.env.BASE_URL}files/curriculo-warlley.pdf`


    return (
        <div className="resume">

            {/* === BARRA DO DOCUMENTO === */}
            <header className="resume-toolbar">
                <div className="resume-file-info">
                    <span className="resume-file-icon">
                        <FileText
                            size={16}
                            strokeWidth={1.8}
                        />
                    </span>

                    <div>
                        <strong>
                            Currículo
                        </strong>

                        <span>
                            curriculo-warlley.pdf
                        </span>
                    </div>
                </div>


                <div className="resume-actions">
                    <a
                        className="resume-action"
                        href={
                            resumeUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ExternalLink
                            size={15}
                            strokeWidth={1.8}
                        />

                        Abrir
                    </a>

                    <a
                        className="resume-action resume-action-primary"
                        href={
                            resumeUrl
                        }
                        download="curriculo-warlley.pdf"
                    >
                        <Download
                            size={15}
                            strokeWidth={1.8}
                        />

                        Baixar
                    </a>
                </div>
            </header>


            {/* === VISUALIZADOR === */}
            <section className="resume-viewer">
                <object
                    className="resume-pdf"
                    data={
                        resumeUrl
                    }
                    type="application/pdf"
                >
                    <div className="resume-fallback">
                        <FileText
                            size={28}
                            strokeWidth={1.7}
                        />

                        <strong>
                            Não foi possível exibir o PDF.
                        </strong>

                        <a
                            href={
                                resumeUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            Abrir arquivo
                        </a>
                    </div>
                </object>
            </section>
        </div>
    )
}

export default Resume