import { useLanguage } from '../../i18n/language'
import {
    Download,
    ExternalLink,
    FileText,
} from 'lucide-react'

import './Resume.css'


/* === CONFIGURAÇÃO === */
const BASE_URL =
    import.meta.env.BASE_URL

const RESUME_URL =
    `${BASE_URL}documents/curriculo-warlley.pdf`


function Resume() {
    const { t } = useLanguage()

    return (
        <div className="resume">

            {/* === BARRA DO DOCUMENTO === */}
            <header className="resume-toolbar">
                <div className="resume-file-info">
                    <span className="resume-file-icon">
                        <FileText
                            size={16}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <strong>{t("Currículo")}</strong>

                        <span>
                            curriculo-warlley.pdf
                        </span>
                    </div>
                </div>


                <div className="resume-actions">
                    <a
                        className="resume-action"
                        href={
                            RESUME_URL
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t("Abrir currículo em nova aba")}
                    >
                        <ExternalLink
                            size={15}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />{t("Abrir")}</a>

                    <a
                        className="resume-action resume-action-primary"
                        href={
                            RESUME_URL
                        }
                        download="curriculo-warlley.pdf"
                        aria-label={t("Baixar currículo em PDF")}
                    >
                        <Download
                            size={15}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />{t("Baixar")}</a>
                </div>
            </header>


            {/* === VISUALIZADOR === */}
            <section
                className="resume-viewer"
                aria-label={t("Visualização do currículo")}
            >
                <object
                    className="resume-pdf"
                    data={
                        RESUME_URL
                    }
                    type="application/pdf"
                    aria-label={t("Currículo de Warlley Silva")}
                >
                    <div className="resume-fallback">
                        <FileText
                            size={28}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />

                        <strong>{t("Não foi possível exibir o PDF.")}</strong>

                        <span>{t("Abra o arquivo diretamente no navegador.")}</span>

                        <a
                            href={
                                RESUME_URL
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >{t("Abrir arquivo")}</a>
                    </div>
                </object>
            </section>
        </div>
    )
}

export default Resume