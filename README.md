# WS OS — Portfólio Profissional

Portfólio de **Warlley Silva**, estudante de Engenharia de Software na PUC Minas. A interface utiliza um desktop com aplicativos e janelas para apresentar formação, projetos, experiências e canais de contato.

![Identidade visual do WS OS](public/assets/branding/ws-os-dark.png)

## Links úteis

- [Site no GitHub Pages](https://warlleyz.github.io/portfolio-warlley/)
- [Repositório](https://github.com/warlleyz/portfolio-warlley)
- [Configuração do formulário](docs/CONTATO.md)
- [Checklist de entrega do laboratório](docs/ENTREGA-LAB01.md)
- [Referência do template de README solicitado](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md)

A configuração para Vercel está em `vercel.json`. O endereço Vercel deverá ser acrescentado após a publicação; nenhum endereço foi inventado.

## Sobre o projeto e funcionalidades

| Seção | Funcionalidade |
| --- | --- |
| Sobre Mim | Perfil, formação, conhecimentos, interesses e objetivos em português e inglês. |
| Projetos | Timeline do mais antigo ao mais recente, busca, filtros, GitHub e demos configuradas. |
| Experiências | Formação acadêmica e desenvolvimento do portfólio, com instituição/projeto, atividade, período e descrição. |
| Contato | E-mail clicável, GitHub, LinkedIn e formulário com nome, e-mail, mensagem e consentimento. O envio depende da configuração EmailJS. |
| Currículo e Certificados | Documentos pessoais e recursos de visualização já existentes. |
| Recursos complementares | Tecnologias, estatísticas, Terminal, Snake, temas, notificações e clima. Alguns recursos dependem de serviços externos. |

Abra um aplicativo pelo atalho ou pelo WS Menu. Os Controles Rápidos permitem escolher **Português/English**, tema, brilho e transparência. O idioma é compartilhado com Sobre Mim, Experiências, Contato e os rótulos principais do shell/Projetos. Conteúdo vindo do GitHub, documentos e apps complementares podem permanecer no idioma original; não se trata de tradução integral de todos os aplicativos.

No celular, as janelas ocupam a área útil acima da barra. A timeline mantém os filtros e se adapta a uma coluna.

## Tecnologias e dependências

| Tecnologia | Uso |
| --- | --- |
| React 19 e React DOM | Componentes, estado e renderização. |
| Vite 8 e plugin React | Desenvolvimento, carregamento sob demanda e build. |
| JavaScript e CSS | Comportamento, temas e layout responsivo. |
| Lucide React e React Icons | Ícones da interface. |
| Supabase JS | Integração opcional do ranking existente do Snake. |
| ESLint e plugins React | Verificação estática de código. |
| Node.js Test Runner | Testes de timeline e formulário, sem biblioteca adicional. |
| GitHub Actions | Lint, testes, build e publicação no GitHub Pages. |

As versões exatas estão em `package.json` e `package-lock.json`. A API REST do EmailJS é usada diretamente, sem SDK adicional.

## Arquitetura

Aplicação React estática, com serviços externos para funcionalidades específicas. Não há servidor próprio ou autenticação administrativa neste escopo.

- `App` inicializa o sistema e controla o tema.
- `Desktop` gerencia abertura, foco, dimensões e ciclo de vida das janelas.
- `components` reúne janela, Taskbar, menu, painéis e componentes compartilhados.
- `apps` contém a interface e o comportamento de cada aplicativo.
- `data` concentra catálogo, projetos e índice de busca.
- `services` integra GitHub e contato, mantendo requisições fora da interface.
- `i18n` compartilha idioma e traduções sem alterar IDs ou comandos internos.

O fluxo do contato é: formulário validado → serviço REST → EmailJS → destinatário fixo no template. A interface só informa sucesso após resposta positiva do serviço. Isso não comprova recebimento ou leitura na caixa final.

## Instalação e execução

Use **Node.js 22.12+ ou 24** e npm.

```bash
git clone https://github.com/warlleyz/portfolio-warlley.git
cd portfolio-warlley
npm ci
npm run dev
```

O caminho padrão local é `/portfolio-warlley/`; use a URL exibida pelo Vite.

```bash
npm run lint
npm test
npm run build
npm run preview
```

O preview serve o conteúdo gerado em `dist`. Não envia e-mails de teste automaticamente.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha somente os serviços que utilizará.

| Variável | Finalidade |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | Identificador público do serviço de envio. |
| `VITE_EMAILJS_TEMPLATE_ID` | Identificador do template com destinatário fixo. |
| `VITE_EMAILJS_PUBLIC_KEY` | Chave pública EmailJS. |
| `VITE_WHATSAPP_NUMBER` | Número real opcional com país e DDD, somente dígitos. |
| `VITE_SUPABASE_URL` | URL do projeto Supabase usado pelo ranking opcional. |
| `VITE_SUPABASE_ANON_KEY` | Chave pública limitada pelas políticas do banco. |

Todas as variáveis `VITE_*` são públicas no frontend. Nunca utilize senhas, chaves privadas ou `service_role`. Não versione `.env.local`.

Sem EmailJS configurado, o formulário informa a indisponibilidade e mantém o envio desabilitado. O e-mail direto e as redes continuam acessíveis. Guia de template, consentimento, timeout e restrições de origem: [CONTATO.md](docs/CONTATO.md).

## Publicação

### GitHub Pages

O workflow existente em `.github/workflows/deploy.yml` executa lint, testes e build antes de publicar. Mantém o caminho `/portfolio-warlley/`. Configure os secrets de mesmo nome das variáveis necessárias. Verifique a execução do workflow e o site após cada publicação.

### Vercel

Importe este repositório na sua conta. A configuração versionada usa `npm run build -- --base=/` e saída `dist`, preservando o caminho padrão do GitHub Pages para os demais builds. Cadastre as variáveis necessárias e faça o deploy. Depois, registre o endereço definitivo neste README e confira as URLs de metadados de `index.html` caso a Vercel se torne o endereço principal.

Não há necessidade de trocar a base do Vite manualmente para cada plataforma. O projeto não usa rotas internas de páginas; os aplicativos abrem na mesma URL.

## Estrutura de pastas

```text
portfolio-warlley/
├── .github/workflows/deploy.yml
├── docs/
│   ├── CONTATO.md
│   └── ENTREGA-LAB01.md
├── public/
│   ├── assets/              # Identidade, foto, cursores e wallpapers
│   ├── certificates/        # Certificados existentes
│   ├── documents/           # Currículo PDF
│   └── projects/            # Demos e mídias públicas
├── src/
│   ├── apps/                # About, Projects, Experiences, Contact e demais apps
│   ├── components/          # Desktop, Window, Taskbar, WSMenu e painéis
│   ├── data/                # Catálogos e projetos
│   ├── i18n/                # Idioma compartilhado e traduções
│   ├── lib/                 # Cliente Supabase existente
│   ├── services/            # GitHub e contato
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tests/
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── vercel.json
└── vite.config.js
```

## Conteúdo, demonstrações e protótipos

- **Sobre Mim:** `src/apps/About/About.jsx`; traduções em `src/i18n/translations.js`.
- **Experiências:** array de `src/apps/Experiences/Experiences.jsx`. Os períodos atuais não inventam datas de contratação; substitua por intervalos reais quando disponíveis.
- **Projetos:** `src/data/projectsData.js`. A timeline utiliza criação do repositório, que pode diferir do início real do desenvolvimento.
- **Capturas/GIFs:** salve arquivos reais em `public/projects/` e configure `screenshot` no projeto correspondente. Exemplo: `screenshot: BASE_URL + 'projects/screenshots/login-puc.png'`. O card exibe a mídia quando cadastrada. Não há capturas fictícias para preencher esse requisito.
- **SnakePy:** configure `demo.video` e `demo.images` após adicionar os arquivos reais. Referências anteriores a arquivos inexistentes foram removidas; a interface informa ausência de mídia.
- **Contato:** canais em `src/apps/Contact/Contact.jsx`, configurações em `.env.local` e no ambiente de hospedagem.
- **Protótipos Figma:** link e imagens ainda precisam ser fornecidos pelo autor. Capturas da aplicação não devem ser apresentadas como protótipos feitos anteriormente.

## Testes e limitações

`npm test` executa testes de ordenação cronológica, datas inválidas, validação de contato, ausência de configuração, resposta do provedor e timeout. As chamadas EmailJS dos testes são simuladas e não enviam mensagens.

Ainda é necessário validar o recebimento real do formulário, inserir capturas/GIFs dos projetos e anexar os protótipos exigidos. A publicação na conta Vercel depende do autor. As APIs externas podem apresentar limite de requisições ou indisponibilidade.

## Autor e referências

**Warlley Silva** — Engenharia de Software, PUC Minas.

- [GitHub](https://github.com/warlleyz)
- [LinkedIn](https://www.linkedin.com/in/warlleysilvab/)
- [React](https://react.dev/), [Vite](https://vite.dev/), [EmailJS](https://www.emailjs.com/docs/rest-api/send/)
- [Template de documentação do professor João Paulo Aramuni](https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md), adaptado ao escopo real desta aplicação.
