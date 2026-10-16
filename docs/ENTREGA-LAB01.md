# Entrega LAB01 — estado e últimos passos

Atualizado em **15/10/2026**. Repositório: `warlleyz/portfolio-warlley` (V1). O projeto V2 não foi modificado nesta adaptação.

## Implementado nesta adaptação

- Sobre Mim completo em PT-BR/EN, mantendo o conteúdo profissional já existente.
- Idioma nos Controles Rápidos, compartilhado com Sobre Mim, Experiências, Contato e os rótulos principais de Desktop/menu/janelas/Projetos. Preferência persistente, com recuperação da chave anterior.
- Experiências: PUC Minas e desenvolvimento do portfólio, com atividade, período e descrição; nenhum emprego ou data foi inventado.
- Timeline de projetos crescente pela criação dos repositórios; datas verificadas dos quatro projetos cadastrados preservam a ordem no fallback local.
- Busca e filtros preservados; busca global corrigida para não retornar todos os apps sem correspondência e com aliases em inglês.
- Captura/GIF opcional em cada card, cadastrável no campo `screenshot` de `src/data/projectsData.js`.
- Formulário de nome, e-mail e mensagem, consentimento, validações, timeout e tratamento de falhas. Envio por API REST EmailJS preparado; exige configuração e teste real.
- Proteção contra perda de mensagem ao fechar/recarregar. Diálogo de descarte dentro da interface; cancelar preserva o rascunho.
- E-mail direto clicável; WhatsApp opcional por configuração, sem telefone inventado.
- Janelas usam área útil no celular; Controles Rápidos continuam acessíveis em telas estreitas.
- Caminhos antigos de mídia SnakePy sem arquivos correspondentes removidos; ausência de mídia é informada e o link para o repositório permanece disponível.
- README adaptado ao template indicado no laboratório, com tecnologias, dependências, arquitetura, estrutura, configuração, uso e publicação.
- Testes executáveis por `npm test` e integrados ao workflow existente.
- `vercel.json` preparado para build na raiz; GitHub Pages mantém sua base original.

## O que você precisa concluir para entregar

### 1. Ativar e testar o envio real

Guia completo: [CONTATO.md](CONTATO.md).

- [ ] Conectar seu serviço de e-mail ao EmailJS.
- [ ] Configurar template com destinatário fixo e parâmetros `from_name`, `from_email`, `reply_to` e `message`.
- [ ] Preencher `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` e `VITE_EMAILJS_PUBLIC_KEY` no ambiente de publicação.
- [ ] Configurar origens e proteção contra abuso no provedor.
- [ ] Publicar um novo build e confirmar que uma mensagem real chega à sua caixa de entrada.

**O formulário ainda não pode ser considerado validado de ponta a ponta.** Na falta de configuração, o envio permanece desabilitado com mensagem explicativa.

### 2. Adicionar capturas reais dos projetos

- [ ] Salvar PNG/JPEG/WebP/GIF em `public/projects/screenshots/`.
- [ ] Preencher `screenshot` no projeto correspondente em `src/data/projectsData.js`, usando `BASE_URL`.
- [ ] Conferir cada imagem na timeline, inclusive no celular.
- [ ] Se desejar a galeria/vídeo do SnakePy, adicionar arquivos reais e preencher `demo.images`/`demo.video`.

Os READMEs e árvores públicas dos quatro projetos foram consultados: não foram encontradas capturas/GIFs de execução reutilizáveis. As imagens de fundo/logo do Login PUC não foram apresentadas como capturas de funcionamento.

### 3. Completar evidências acadêmicas

- [ ] Adicionar link do Figma e imagens dos wireframes/protótipos no README.
- [ ] Conferir se o protótipo corresponde às seções apresentadas.
- [ ] Revisar as experiências e, caso possua datas exatas, substituir períodos genéricos pelos intervalos reais.
- [ ] Preparar a explicação de design, arquitetura e funcionalidades para apresentação.

### 4. Publicar e conferir

- [ ] Confirmar a execução do workflow do GitHub Pages após os pushes.
- [ ] Se usar Vercel, importar o repositório, configurar variáveis e validar o domínio gerado.
- [ ] Registrar o endereço Vercel no README caso seja a entrega escolhida.
- [ ] Se Vercel for o endereço principal, atualizar canonical/Open Graph em `index.html` para o domínio real.
- [ ] Testar as quatro seções obrigatórias, documentos, links e formulário no endereço publicado.

## Validação realizada

- ESLint aprovado.
- Build padrão GitHub Pages aprovado.
- Build com `--base=/` (configuração Vercel) aprovado.
- Testes automatizados de timeline, contato e busca; consulte `npm test` para a contagem atual.
- Navegador: troca de idioma nos Controles Rápidos refletiu imediatamente no Sobre Mim; preferência recuperada após recarga durante os ensaios.
- Navegador: formulário sem configuração identificado e envio desabilitado; cancelamento do descarte preservou o texto digitado.
- Tela 390×844: Contato sem overflow horizontal, painel dentro da tela e botão de Controles Rápidos visível.
- Tela 320×740: Projetos sem overflow horizontal e datas em ordem crescente.
- Busca por termo inexistente exibiu estado vazio. Nenhum erro de execução foi observado no console da aba final nesses ensaios.

## Limites do aceite

- Testes de envio usam rede simulada; nenhum e-mail real foi disparado.
- Build preparado não significa deploy Vercel executado ou validado.
- Capturas reais, protótipos e revisão final das informações dependem do autor.
- Os testes de viewport não substituem toque físico, leitor de tela ou revisão completa de todos os apps complementares.
- A preferência de idioma não traduz automaticamente documentos, descrições do GitHub ou todos os aplicativos complementares.
- O ranking Supabase e integrações anteriores foram preservados; não houve migração de banco nem auditoria integral desses serviços nesta adaptação.

Não declarar atendimento integral do laboratório enquanto os itens externos acima permanecerem pendentes.

## Conferência final da versão compilada

Nove testes aprovados, lint aprovado e builds padrão e raiz aprovados. No preview de produção com base raiz, página, JavaScript principal, fotografia e currículo PDF retornaram HTTP 200 com tipos de conteúdo adequados. O navegador abriu o Sobre Mim compilado e aplicou a troca de idioma pelo painel sem erros de execução observados. Isso valida o build local; não comprova o deploy na Vercel nem o envio real de e-mail.
