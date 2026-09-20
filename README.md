# WS OS — Interactive Portfolio

Portfólio pessoal desenvolvido como uma experiência de sistema operacional desktop.

O **WS OS** transforma um portfólio tradicional em um ambiente interativo com janelas, aplicativos, terminal, projetos, estatísticas, currículo, notificações, clima e até um jogo Snake.

> Desenvolvido com React, Vite e JavaScript, com foco em interface, experiência do usuário, organização de código e performance.

---

## Visão geral

O projeto simula a experiência de um sistema operacional moderno diretamente no navegador.

Em vez de páginas convencionais, o visitante navega pelo portfólio através de um desktop com aplicativos independentes.

Entre as principais funcionalidades estão:

- janelas arrastáveis e redimensionáveis;
- minimizar, maximizar, restaurar e fechar aplicativos;
- controle de foco e `z-index`;
- barra de tarefas;
- menu de aplicativos;
- notificações;
- controles rápidos;
- tema claro e escuro;
- terminal interativo;
- projetos integrados ao GitHub;
- estatísticas do GitHub e WakaTime;
- currículo;
- formulário de contato;
- widget de clima;
- jogo Snake com ranking global.

---

## Tecnologias

### Front-end

- React 19
- Vite
- JavaScript
- CSS
- Lucide React
- React Icons

### Integrações

- GitHub API
- WakaTime
- Open-Meteo
- Supabase

### Ferramentas

- ESLint
- Git
- GitHub
- GitHub Pages

---

## Aplicativos

### Sobre

Apresenta informações pessoais e profissionais dentro de uma interface integrada ao WS OS.

### Projetos

Centraliza os projetos do portfólio e também sincroniza repositórios públicos através da API do GitHub.

Possui:

- pesquisa;
- filtros por tecnologia;
- dados de estrelas e forks;
- tecnologias utilizadas;
- data da última atualização;
- acesso ao repositório;
- abertura de demos dentro do próprio sistema.

### Tecnologias

Exibe as principais tecnologias utilizadas nos projetos e estudos.

### Currículo

Disponibiliza o currículo diretamente dentro do ambiente do portfólio.

### Contato

Área dedicada aos canais de contato profissional.

### Estatísticas

Combina informações públicas do GitHub com dados de programação do WakaTime.

Entre os dados exibidos estão:

- número de repositórios;
- seguidores;
- estrelas;
- linguagem principal;
- tempo de programação;
- linguagens mais utilizadas;
- atividade dos últimos dias, semanas e meses.

### Terminal

Interface inspirada em um terminal real para navegar pelo portfólio através de comandos.

Os comandos utilizam os mesmos dados dos aplicativos e projetos do sistema, evitando duplicação de informações.

### Snake

Versão do clássico Snake integrada ao WS OS.

As comidas do jogo são representadas por tecnologias como:

- Java;
- JavaScript;
- Python;
- HTML;
- CSS;
- Docker;
- Git;
- Spring.

O jogo possui:

- pontuação;
- recorde local;
- aumento progressivo de velocidade;
- pausa;
- controles por teclado;
- ranking global com Supabase.

---

## Sistema de janelas

O WS OS possui um gerenciador de janelas próprio desenvolvido em React.

Cada aplicativo pode ser:

- aberto;
- fechado;
- minimizado;
- restaurado;
- maximizado;
- arrastado;
- redimensionado pelos lados e cantos.

O sistema também controla:

- posição;
- dimensões;
- aplicativo ativo;
- ordem de sobreposição;
- animações;
- estado de minimização;
- múltiplas janelas abertas simultaneamente.

Os listeners globais utilizados durante arraste e redimensionamento são registrados somente enquanto existe uma interação ativa.

---

## GitHub API

Os dados do GitHub são centralizados em:

```text
src/services/githubService.js
```

O serviço possui cache temporário para reduzir requisições repetidas.

Aplicativos diferentes podem reutilizar os mesmos dados de:

- perfil;
- repositórios;
- linguagens;
- estrelas;
- forks;
- datas de atualização.

Também existe compartilhamento de requisições em andamento, evitando chamadas duplicadas caso dois aplicativos solicitem os mesmos dados simultaneamente.

---

## Performance

Os aplicativos utilizam **code splitting** com:

```js
React.lazy()
```

e:

```js
Suspense
```

Dessa forma, cada aplicativo é carregado somente quando necessário.

### Resultado do build

Antes da divisão dos módulos, o bundle JavaScript principal possuía aproximadamente:

```text
556 kB
```

Após a implementação de carregamento sob demanda:

```text
Bundle principal: 258.56 kB
Gzip:             80.54 kB
```

Isso representa uma redução de aproximadamente **53% no JavaScript principal inicial**.

Aplicativos como:

```text
Game
Projects
Stats
Terminal
About
Contact
Resume
Technologies
```

agora são distribuídos em chunks independentes.

O CSS também é dividido entre os aplicativos quando possível.

---

## Estrutura do projeto

```text
portfolio-warlley/
├── public/
│   ├── assets/
│   │   ├── branding/
│   │   ├── cursors/
│   │   ├── profile/
│   │   └── wallpapers/
│   ├── documents/
│   └── projects/
│
├── src/
│   ├── apps/
│   │   ├── About/
│   │   ├── Contact/
│   │   ├── Game/
│   │   ├── Projects/
│   │   ├── Resume/
│   │   ├── Stats/
│   │   ├── Technologies/
│   │   └── Terminal/
│   │
│   ├── components/
│   │   ├── BootScreen/
│   │   ├── Desktop/
│   │   ├── Notifications/
│   │   ├── QuickControls/
│   │   ├── Taskbar/
│   │   ├── Tooltip/
│   │   ├── Window/
│   │   └── WSMenu/
│   │
│   ├── data/
│   ├── lib/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## Design

A interface utiliza uma identidade visual própria inspirada em sistemas operacionais modernos, sem reproduzir diretamente uma interface existente.

A direção visual utiliza:

- tons de azul-marinho;
- grafite;
- cinza claro;
- azul frio como cor de destaque;
- transparências controladas;
- glassmorphism;
- sombras suaves;
- animações discretas.

O sistema também possui temas claro e escuro.

---

## Tooltips

O projeto possui um componente próprio de Tooltip utilizando `createPortal`.

Isso permite que os tooltips sejam renderizados fora de containers com `overflow`, evitando cortes dentro de janelas e painéis.

O componente também:

- ajusta a posição automaticamente;
- detecta limites da viewport;
- alterna entre cima, baixo, esquerda e direita;
- possui suporte a foco por teclado;
- utiliza `aria-describedby`.

---

## Clima

O widget de clima utiliza:

- Geolocation API do navegador;
- Open-Meteo.

A localização é utilizada somente para consultar o clima atual.

As coordenadas não são armazenadas pelo WS OS.

Caso a localização seja bloqueada ou indisponível, o restante do sistema continua funcionando normalmente.

---

## Ranking do Snake

O ranking global utiliza Supabase.

A tabela esperada é:

```text
snake_scores
```

com os campos:

```text
player_name
score
```

O uso do Supabase é opcional.

Sem configuração, o Snake continua funcionando normalmente com recorde local.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

```env
VITE_SUPABASE_URL=SEU_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=SUA_SUPABASE_ANON_KEY
```

As variáveis são utilizadas exclusivamente para os recursos que dependem do Supabase.

---

## Executando localmente

Clone o projeto:

```bash
git clone https://github.com/warlleyz/portfolio-warlley.git
```

Entre no diretório:

```bash
cd portfolio-warlley
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

---

## Build

Gerar o build de produção:

```bash
npm run build
```

Testar o build localmente:

```bash
npm run preview
```

Executar o ESLint:

```bash
npm run lint
```

---

## Deploy

O projeto utiliza Vite com o caminho base:

```text
/portfolio-warlley/
```

preparado para publicação através do GitHub Pages.

URL prevista:

```text
https://warlleyz.github.io/portfolio-warlley/
```

---

## Objetivo

O WS OS foi desenvolvido não apenas como uma página para apresentar projetos, mas também como um projeto de desenvolvimento por si só.

Ele explora conceitos como:

- componentização;
- gerenciamento de estado;
- manipulação de eventos;
- interfaces desktop;
- integração com APIs;
- carregamento assíncrono;
- cache;
- code splitting;
- acessibilidade;
- responsividade;
- persistência local;
- integração com serviços externos.

---

## Autor

**Warlley Silva**

GitHub:  
https://github.com/warlleyz

---

## Status

O projeto está em desenvolvimento contínuo e recebe melhorias de interface, performance, acessibilidade e novos projetos.