# Publicação final — footer, marca e PWA

## Contatos oficiais informados pela loja
- Instagram: https://www.instagram.com/penseiemvocedoces/
- Contato: +55 47 9667-5064
- Cidade: Joinville – SC

O rodapé exibe Instagram e WhatsApp clicáveis, além da localização. Configurações definidas no painel da marca têm prioridade; quando telefone/Instagram vierem vazios da API, o frontend usa estes valores oficiais como fallback. Não foi inventado endereço físico de retirada.

## Identidade visual
Logo obtida **exatamente da página 5 do PDF CMYK - LOGO - PENSEI EM VOCE**, por renderização e recorte, para:
- `public/icons/icon-32.png`: favicon, 32×32
- `public/icons/icon-192.png`: ícone PWA/Apple, 192×192
- `public/icons/icon-512.png`: ícone PWA, 512×512

O código-fonte original está no PDF enviado no chat; o repositório contém apenas os ícones PNG derivados. Se substituir a logo, regenere os tamanhos e publique novo deploy.

## Funcionalidade PWA
- `public/manifest.webmanifest` define nome, escopo, cores, modo standalone, ícones oficiais.
- `index.html` informa manifest, favicon, touch icon e metadados.
- `public/sw.js` atende à navegação offline com uma página informativa; armazena apenas arquivos estáticos públicos. **Não guarda pedidos, autenticação, respostas de API ou dados de clientes.**
- `src/main.js` registra o SW apenas em build de produção.
- `public/offline.html` comunica indisponibilidade da internet e não permite finalizar pedido offline.
- Publicação requer HTTPS (ou localhost para testes).

## Testes pós-deploy
1. Executar `npm ci && npm run lint && npm test && npm run build`.
2. Conferir `/manifest.webmanifest`, `/sw.js`, `/icons/icon-192.png`, `/icons/icon-512.png` acessíveis sem 404.
3. DevTools → Application → Manifest: instalar e conferir ícone/nome.
4. Application → Service Workers: verificar registro e comportamento offline.
5. Verificar login/refresh e pedidos online; nenhuma resposta de API deve aparecer no Cache Storage.
6. Se usar Vercel, configurar variável `VITE_API_BASE_URL=https://SEU-BACKEND.vercel.app/api/` e domínio de frontend em `FRONTEND_URLS` no backend.

## Limites
PWA instalável não significa checkout offline. Navegação sem internet exibe a página offline.
O servidor de produção pode precisar liberar arquivos estáticos no roteamento, e o navegador poderá exigir limpar service workers antigos após migrações.
