<script setup>
import { useAuthStore } from '../../stores/authStore'
const auth = useAuthStore()
</script>
<template>
  <nav class="bottom-nav" aria-label="Navegação móvel">
    <RouterLink to="/"><span aria-hidden="true">⌂</span>Início</RouterLink>
    <RouterLink to="/cardapio"><span aria-hidden="true">▦</span>Cardápio</RouterLink>
    <RouterLink to="/carrinho" class="cart"><span aria-hidden="true">♡</span>Carrinho</RouterLink>
    <RouterLink to="/atendimento"><span aria-hidden="true">?</span>Ajuda</RouterLink>
    <RouterLink v-if="auth.user?.is_superuser" to="/admin"><span aria-hidden="true">⚙</span>Painel</RouterLink>
    <RouterLink v-else-if="auth.isAuthenticated" to="/meus-pedidos"><span aria-hidden="true">♙</span>Pedidos</RouterLink>
    <RouterLink v-else to="/entrar"><span aria-hidden="true">♙</span>Conta</RouterLink>
  </nav>
</template>
<style scoped>
.bottom-nav { display: none; }
@media(max-width: 800px) {
  .bottom-nav { display: flex; justify-content: space-around; align-items: center; gap: .2rem;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 30;
    background: #fffdfb; border-top: 1px solid var(--color-border);
    padding: .65rem .5rem max(.7rem, env(safe-area-inset-bottom)); }
  .bottom-nav a { display: grid; justify-items: center; gap: .1rem; font-size: .72rem;
    font-weight: 800; text-decoration: none; color: #725a68; min-width: 48px; }
  .bottom-nav span { font-size: 1.35rem; line-height: 1.3; }
  .bottom-nav .cart span { color: white; background: var(--color-primary);
    border-radius: 50%; width: 37px; height: 37px; display: grid; place-items: center; }
  .bottom-nav a.router-link-active { color: var(--color-primary-hover); }
}
</style>
