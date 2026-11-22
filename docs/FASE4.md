# Fase 4 — Atendimento e gestão comercial

**Branch:** `FEAT-16`; integração somente por PR para `dev`.
**Backend correspondente:** `Backend-PEVD/FEAT-18`.

## Funcionalidades reais
- `/atendimento`: FAQ pesquisável carregado da API. Sem dados, exibe estado vazio.
- `/contato`: formulário público com consentimento, honeypot e confirmação após API HTTP 202. **Não é chat**, nem envia e-mails sem SMTP real configurado.
- `/atendimento/duvidas`: cliente autenticado abre ticket e acompanha a thread; pode vincular somente pedido próprio por UUID público.
- `/atendimento/duvidas/:id`: mensagens privadas, atualização de estado e bloqueio de conversas encerradas.
- `/encomendas-personalizadas`: solicita orçamento e acompanha propostas. Aceite de proposta **não cria um pedido nem cobra**; depende de confirmação comercial posterior.
- `/admin`: visão geral com métricas reais, gestão FAQ, suporte, contatos, orçamento, banners e configurações comerciais. Proteção real é feita pela API com `IsActiveSuperUser`.
- Home exibe apenas banners publicados e FAQ persistido. Não há avaliações, ofertas ou fotos inventadas.

## Testar localmente
```sh
npm install
npm run lint
npm test
npm run build
npm run dev
```
No backend: `pdm install`, `pdm run migrate`, `pdm run check`, `pdm run lint`, `pdm run test`, `pdm run dev`.

## Pendências de homologação
1. Verificar integração E2E com PostgreSQL e cookies HTTPS em staging.
2. Validar limites antispam em cache distribuído/edge em produção; throttle DRF não basta.
3. Configurar email real se notificações forem desejadas; nenhuma mensagem é prometida por email agora.
4. Inserir e conferir cinco ou mais respostas reais de FAQ pela proprietária; prazos e meios de contato confirmados.
5. Auditoria de privacidade e retenção de contatos, tickets e orçamentos, acesso admin, exclusão/exportação conforme política aplicável.
6. Revisar procedimentos para aceitar orçamento e convertê-lo em pedido sem preço arbitrário.
7. Testar acessibilidade/mobile, logs e backups antes de integrar `main`.
