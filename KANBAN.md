# Kanban — Pensei em Você Doces (Frontend)

A conexão GitHub disponível gerencia issues e PRs, mas não cria um GitHub Project nativo; este arquivo acompanha o quadro.

## Concluído em dev — Fase 4
- [#16](https://github.com/LucasFontini1/Frontend-PEVD/issues/16): FAQ pesquisável e contato público.
- [#17](https://github.com/LucasFontini1/Frontend-PEVD/issues/17): tickets privados e mensagens de resposta.
- [#18](https://github.com/LucasFontini1/Frontend-PEVD/issues/18): orçamento personalizado e aceite explícito.
- [#19](https://github.com/LucasFontini1/Frontend-PEVD/issues/19): painel FAQ, tickets, orçamentos, contato, banners e dashboard real.
- [PR #20](https://github.com/LucasFontini1/Frontend-PEVD/pull/20): integrado na dev com lint, Vitest e build.

## Refatoração e gestão comercial — integrado em dev (22/11/2026)
- [#22](https://github.com/LucasFontini1/Frontend-PEVD/issues/22): nova identidade visual rosa/creme baseada nos exemplos fornecidos; home, cards, categorias, header, navegação mobile, catálogo, produto, carrinho, checkout, autenticação, rodapé e painel.
- [#23](https://github.com/LucasFontini1/Frontend-PEVD/issues/23): sessão restaurada automaticamente via refresh HttpOnly (7 dias) e access em memória (10 minutos), com hostname local consistente; não salva JWT em localStorage.
- [#24](https://github.com/LucasFontini1/Frontend-PEVD/issues/24): busca por nome no painel de produtos, categorias, FAQs, banners e atendimento; produtos/categorias consultam API além dos 100 primeiros.
- [#25](https://github.com/LucasFontini1/Frontend-PEVD/issues/25): criação de pedido WhatsApp por admin e relatório de concluídos/CSV.
- [PR #26](https://github.com/LucasFontini1/Frontend-PEVD/pull/26): squash merge em dev. ESLint, build e 16 Vitest aprovados.
- [docs/UX_WHATSAPP.md](docs/UX_WHATSAPP.md): descrição e checklist de homologação visual e funcional.

## Correções de UX e tutorial — 22/11/2026
- [#27](https://github.com/LucasFontini1/Frontend-PEVD/issues/27): conversa expande dentro do ticket com detalhe atualizado e resposta/encerramento.
- [#28](https://github.com/LucasFontini1/Frontend-PEVD/issues/28): botões padronizados pelo design system global, cards administrativos, formulários, foco e responsividade, scroll ao editar.
- [#29](https://github.com/LucasFontini1/Frontend-PEVD/issues/29): tutorial em /tutorial, modo cliente e modo admin, links no menu/rodapé.
- [PR #30](https://github.com/LucasFontini1/Frontend-PEVD/pull/30): merge em dev após 19 testes Vitest, ESLint e build.
- [Documentação](docs/UI_TUTORIAL.md): testes e detalhes. **Validar manualmente com navegador e dados reais antes de main.**

## Em homologação / backlog
- [#21](https://github.com/LucasFontini1/Frontend-PEVD/issues/21): E2E atendimento e conteúdo real em staging.
- [#15](https://github.com/LucasFontini1/Frontend-PEVD/issues/15): E2E checkout e acessibilidade.
- [#2](https://github.com/LucasFontini1/Frontend-PEVD/issues/2), [#3](https://github.com/LucasFontini1/Frontend-PEVD/issues/3), [#4](https://github.com/LucasFontini1/Frontend-PEVD/issues/4), [#5](https://github.com/LucasFontini1/Frontend-PEVD/issues/5): pendências de Fase 1.

## Próxima fase
- Fase 5: PWA offline somente para conteúdo público, SEO e dados locais reais, políticas legais revisadas, staging e deploy.

**main bloqueada até homologação.** Não inserir avaliações, prazos e promoções inventados.
