# Correções UX — Atendimento, botões e tutorial

## Bugs corrigidos
- A opção "Abrir conversa" no painel agora **busca a thread específica** em `GET /api/admin/support/tickets/{id}/` e expande as mensagens **dentro do próprio card**. Antes, o detalhe aparecia após todos os tickets, fora da região visível ao clicar no primeiro.
- A administração pode responder, confirmar envio e encerrar a conversa sem perder a seleção; atendimentos encerrados continuam legíveis.
- Botões sem `class` recebem estilo coerente de `src/styles/buttons.css`: estados hover/foco/disabled e variações `button`, `button-outline`, `button-danger`, `button-ghost`.
- Página pública `/tutorial`, com passos para clientes e tutorial do painel condicionado a `is_superuser`; links internos pelo menu e rodapé.

## Testes
```sh
npm install
npm run lint
npm test
npm run build
npm run dev
```

## Validação visual
Testar usando dados reais e telas desktop/móvel. Capturas do usuário demonstravam botões sem padding, elemento de conversa fora da região visível e imagem de perfume cadastrada num banner. A imagem de perfume é conteúdo do banco: não alteramos nem apagamos imagens enviadas pelo administrador; troque pela foto da confeitaria na aba Banners.

A conta administradora deve ter `is_superuser` ativo. O tutorial não altera nem simula pagamentos/pedidos.
