# Pensei em Você Doces — Frontend

Vue 3, Vite, Pinia, Vue Router e Axios. Aplicação da **Fase 1**, sem catálogo nem pedidos simulados.

## Desenvolvimento
Copie `.env.example` para `.env`, configure `VITE_API_BASE_URL`, execute `npm install`, `npm run dev`.
Validação: `npm run build`, `npm test`, `npm run lint`.

## Segurança
Access JWT permanece em memória; refresh em cookie HttpOnly pelo backend. Não armazenar tokens em localStorage. O acesso comercial é revalidado no servidor em `GET /api/admin/access/`.

## Status
Login/cadastro devem ser validados integrados ao backend antes do merge em main. Recuperação e confirmação de e-mail são pendentes.
