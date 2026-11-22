# Fase 2 — Catálogo e administração

Branch de implementação: `FEAT-7`, pull request para `dev`.

## Rotas
- `/`: vitrine real, categorias e destaques
- `/cardapio`: busca/filtros e paginação
- `/categoria/:slug`: produtos de categoria
- `/produto/:slug`: detalhes, fotos, preço, alergênicos e opções
- `/admin`: CRUD de produtos/categorias, fotos, opções e identidade visual (autorização revalidada no backend)

A loja não inventa produtos: sem registros publicados exibe estado vazio. Carrinho e checkout reais serão implementados na Fase 3.

## Testar
```sh
npm install
npm run lint
npm test
npm run build
npm run dev
```
Backend local configurado em `.env` (`VITE_API_BASE_URL=http://127.0.0.1:8000/api/`). Fazer login com superuser criado no backend, cadastrar categoria, produto e mídia pelo admin. Testar navegação anônima em janela privativa.

A API exige upload pelo `/api/media/images/` existente e registro de imagem por `attachment_key`. Fotos definitivas, cardápio, preços e identidade precisam de aprovação da proprietária.
