import {
    GitBranch,
    Link,
    Mail,
} from 'lucide-react'

import './Contact.css'

const contactLinks = [
    {
        label: 'E-mail',
        value: 'warlleysilvax@gmail.com',
        href: 'mailto:warlleysilvax@gmail.com',
        icon: Mail,
    },
    {
        label: 'GitHub',
        value: 'github.com/warlleyz',
        href: 'https://github.com/warlleyz',
        icon: GitBranch,
    },
    {
        label: 'LinkedIn',
        value: 'linkedin.com/in/warlleysilvab',
        href: 'https://www.linkedin.com/in/warlleysilvab/',
        icon: Link,
    },
]

function Contact() {
    const openLink = (href) => {
        window.open(
            href,
            '_blank',
            'noopener,noreferrer',
        )
    }

    return (
        <div className="contact">
            <div className="contact-header">
                <span className="contact-label">
                    Contato
                </span>

                <h1>Vamos conversar</h1>

                <p>
                    Você pode entrar em contato comigo
                    pelos canais abaixo.
                </p>
            </div>

            <div className="contact-grid">
                {contactLinks.map((contact) => {
                    const Icon = contact.icon

                    return (
                        <button
                            key={contact.label}
                            type="button"
                            className="contact-card"
                            onClick={() =>
                                openLink(contact.href)
                            }
                        >
                            <div className="contact-icon">
                                <Icon
                                    size={22}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div className="contact-content">
                                <span>
                                    {contact.label}
                                </span>

                                <strong>
                                    {contact.value}
                                </strong>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Contact