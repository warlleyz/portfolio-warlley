# Configurar envio de contato

O formulário usa a API REST do EmailJS, sem instalar SDK e sem chave privada no frontend.

## Estado atual

Os três identificadores públicos fornecidos pelo autor estão configurados em `src/services/contactService.js`. O site publicado pode habilitar o formulário sem cadastrar secrets adicionais. As variáveis de ambiente abaixo são opcionais para substituir esses identificadores. Nenhuma senha ou chave privada foi adicionada. O recebimento real ainda precisa ser confirmado pelo autor.

## Configuração

1. Na sua conta EmailJS, conecte um serviço de e-mail e crie um template.
2. Defina o destinatário fixo como seu e-mail no painel do provedor. Não use um destinatário controlado pelo visitante.
3. No template, utilize `{{from_name}}`, `{{from_email}}` e `{{message}}`. Defina Reply-To como `{{reply_to}}`. Use as variáveis em texto, sem renderizar a mensagem como HTML não escapado.
4. Copie `.env.example` para `.env.local` e preencha somente os identificadores públicos:

```dotenv
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

5. Restrinja as origens autorizadas no EmailJS aos seus domínios e, durante desenvolvimento, à origem local necessária. Configure as proteções contra abuso disponibilizadas na sua conta. Honeypot e intervalo no navegador não substituem proteção no provedor.
6. Reinicie o desenvolvimento ou faça um novo build/deploy após alterar variáveis. Em Vercel, cadastre-as nas Environment Variables. Em GitHub Pages, cadastre-as nos secrets de mesmo nome usados pelo workflow.
7. Envie uma mensagem de teste pelo site e confirme o recebimento na caixa de entrada. Testes automatizados usam rede simulada e não comprovam entrega real.

Nunca coloque senha de e-mail, chave privada EmailJS, token administrativo ou `service_role` em variáveis `VITE_*`.

## WhatsApp opcional

Preencha `VITE_WHATSAPP_NUMBER` com seu número real, incluindo país e DDD, apenas dígitos. Se vazio, o canal não aparece. O código não contém telefone inventado.

## Comportamento

- Nome de 2–100 caracteres, e-mail válido e mensagem de 10–5000 caracteres.
- Consentimento explícito antes de enviar nome, e-mail e mensagem ao EmailJS.
- Sem configuração, o botão fica desabilitado e o contato direto por e-mail continua acessível.
- Sucesso exige resposta de sucesso do provedor; não significa comprovação de leitura ou recebimento na caixa final.
- Timeout de 15 segundos, sem repetição automática. O visitante é avisado de que o envio não foi confirmado.
- Rascunho em memória; não é salvo no navegador nem enviado enquanto o visitante não submeter.
- O fechamento solicita confirmação quando há mensagem não enviada.

Referências: [API REST /send](https://www.emailjs.com/docs/rest-api/send/) e [templates](https://www.emailjs.com/docs/tutorial/creating-email-template/).
