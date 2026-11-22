# Fase 3 — Carrinho e pedidos

Frontend em `FEAT-11` sobre `dev`. Backend correlato: `Backend-PEVD/FEAT-12`.

## Fluxo real
1. Visitante abre `/produto/:slug`, seleciona opções e quantidade, adiciona ao carrinho.
2. Carrinho usa `localStorage` apenas para IDs de produto, IDs de opção e quantidades; **não armazena preços**.
3. Ao finalizar anonimamente, vai para `/entrar?redirect=/checkout`. Login devolve ao checkout preservando o carrinho.
4. Usuário informa retirada/entrega, data e endereço, solicita cotação via `POST /api/orders/quote/`.
5. Total é recalculado no servidor; ao confirmar, `POST /api/orders/` recebe mesma seleção + `quote_hash` e UUID de idempotência.
6. Pedido é persistido no backend e exibido em `/pedido-confirmado/:codigo`; acompanhamento em `/meus-pedidos`.
7. Administradora usa `/admin` para cadastrar horários, zonas, bloqueios, mudar status e registrar pagamento manual.

**Sem horários reais cadastrados, checkout permanece bloqueado.** Sem zonas, não há entrega. Sem gateway: status inicial do pagamento é pendente. Não gera PIX fictício.

## Testes
```sh
npm install
npm run lint
npm test
npm run build
```
Inicie backend Python 3.14 com `pdm install`, `pdm run migrate`, `pdm run dev`.
Crie superuser e configure agenda/CEP antes de testar pedido real.
Verificar envio repetido, alteração de preços, login e acesso isolado por cliente.

## Pendências para homologação
Concorrência real no PostgreSQL, múltiplos navegadores, cookies HTTPS/CORS, pagamentos e políticas comerciais autorizadas. Não integrar main enquanto essas validações faltarem.
