# Refatoração UX e gestão WhatsApp

## Identidade visual
As referências enviadas orientaram um visual rosa/creme, hero em duas colunas, categorias circulares, produtos em cards, navegação desktop sticky e menu inferior mobile. As fotos vêm **somente das imagens cadastradas**. Sem fotos ou avaliações inventadas, usa-se um estado ilustrado/vazio.

## Sessão
O access token continua em **memória por 10 minutos**. A sessão é recuperada na abertura da aplicação pelo refresh token de **7 dias** em cookie HttpOnly, com rotação no backend. Não armazenar JWT em localStorage. Em desenvolvimento, o frontend escolhe a mesma hostname do Vite para acessar a API (localhost → localhost, 127.0.0.1 → 127.0.0.1), mantendo SameSite=Lax.

## Administração
Painel com sidebar, busca por nome em produtos/categorias (servidor), FAQ, banners, tickets, orçamentos e contatos. Pedidos têm navegação para lista, criação manual WhatsApp e relatório.

A tela "Novo pedido WhatsApp" pede nome/telefone, email de conta existente opcional, retirada/entrega, data/horário, itens e personalização. A simulação monetária é informativa; o backend **recalcula os preços e frete**. O pagamento permanece pendente até confirmação explícita do admin.

Relatório de pedidos `concluido`: resumo separado por `pago` e `pendente`, filtros pela data de conclusão, exportação CSV. **Não** é conciliação financeira.

## Checklist antes de produção
- Validar medidas e responsividade em smartphone, tablet e desktop reais.
- Testar com dados comerciais reais, fotos da confeitaria, acessibilidade e contraste.
- Testar refresh cookie HTTPS entre domínio da aplicação e da API; em hosts totalmente diferentes, rever configuração de cookies com validação de CSRF.
- Testar pedido manual de entrega, adicional obrigatório, fuso horário, falha de rede e repetição do envio.
- Verificar dados do WhatsApp com autorização do cliente e políticas de privacidade; não divulgar informações pessoais do relatório.
- Integração staging PostgreSQL, migrações e E2E antes de publicar a `main`.

Código em `FEAT-22` (Frontend) e `FEAT-27` (Backend), integrado somente com CI verde.
