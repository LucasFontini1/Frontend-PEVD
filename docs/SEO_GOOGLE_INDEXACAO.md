# SEO e Google Search Console — Pensei em Você Doces

Domínio principal configurado: **https://penseiemvocesdoces.vercel.app**.

## Recursos criados
- `public/robots.txt`: permite rastreamento e referencia o sitemap.
- `public/sitemap.xml`: sitemap de fallback das páginas públicas.
- `scripts/generate-sitemap.mjs`: durante `npm run build`, regenera `public/sitemap.xml` com páginas públicas e tenta adicionar categorias e produtos ativos retornados pela API. Se a API estiver indisponível, mantém as páginas públicas fixas e avisa no log. Cadastre `VITE_API_BASE_URL` corretamente no build da Vercel e publique novamente após alterações relevantes no catálogo.
- `public/google34817bb64d7471c4.html`: conteúdo de verificação do Google fornecido pela loja, servido em `/google34817bb64d7471c4.html`. É **verificação do Search Console**, não instalação do Google Analytics.
- `src/utils/seo.js`: title, description, Open Graph, canonical e meta robots na navegação Vue. Produtos e categorias publicados recebem metadados com nomes reais após carregar seus dados.
- `vercel.json`: cabeçalho `X-Robots-Tag: noindex` para rotas privadas, inclusive `/admin`.
- `index.html`: dados estruturados Bakery com Joinville/SC, redes e telefone. Não inventar endereço completo ou avaliação.

## Verificação de produção (após a Vercel publicar)
1. Abra `https://penseiemvocesdoces.vercel.app/google34817bb64d7471c4.html`. O conteúdo precisa ser **exatamente** `google-site-verification: google34817bb64d7471c4.html`, sem redirecionamento para a aplicação.
2. Abra `https://penseiemvocesdoces.vercel.app/robots.txt` e `https://penseiemvocesdoces.vercel.app/sitemap.xml`, confirme que são texto e XML, respectivamente, não HTML do SPA.
3. Vá a https://search.google.com/search-console, adicione propriedade do tipo **Prefixo de URL** com `https://penseiemvocesdoces.vercel.app/`. Escolha método **Arquivo HTML** e clique em verificar.
4. No menu **Sitemaps**, envie `sitemap.xml`. Use **Inspeção de URL** para solicitar indexação da home e cardápio.
5. Confirme via DevTools Network que `/admin`, `/checkout`, `/meus-pedidos` recebem `X-Robots-Tag: noindex`; elas requerem autenticação conforme o caso.
6. Faça testes com Google URL Inspection para verificar se o conteúdo Vue foi renderizado, se as URLs canônicas estão corretas e se Google consegue acessar produtos e categorias.
7. Quando cadastrar produtos novos ou alterar o domínio oficial, gere novo deploy para atualizar sitemap e `robots.txt`/URL canônica.

## Limitações
- Vue SPA produz HTML inicial com texto genérico; títulos dinâmicos de produtos são aplicados via JavaScript. O Google pode renderizá-los, mas **pré-renderização/SSR** continua sendo uma melhoria desejável para SEO mais robusto e para compartilhamento social.
- O sitemap é atualizado **no build**, não automaticamente a cada produto criado.
- Indexação não é garantida pela configuração: depende do Google, qualidade do conteúdo e acessibilidade das páginas.
- Se migrar para domínio próprio, configure `VITE_SITE_URL`, atualize o sitemap do robots e gere redirecionamentos permanentes.
