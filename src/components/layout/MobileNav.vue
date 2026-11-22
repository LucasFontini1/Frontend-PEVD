<script setup>
import { useAuthStore } from '../../stores/authStore'
const auth = useAuthStore()
</script>
<template>
  <nav class="bottom-nav" aria-label="Navegação móvel">
    <RouterLink to="/">Início</RouterLink>
    <RouterLink to="/cardapio">Cardápio</RouterLink>
    <RouterLink to="/carrinho">Carrinho</RouterLink>
    <RouterLink to="/atendimento">Ajuda</RouterLink>
    <RouterLink v-if="auth.user?.is_superuser" to="/admin">Admin</RouterLink>
    <RouterLink v-else-if="auth.isAuthenticated" to="/meus-pedidos">Pedidos</RouterLink>
    <RouterLink v-else to="/entrar">Conta</RouterLink>
  </nav>
</template>
<style scoped>
.bottom-nav { display: none; }
@media(max-width: 600px) {
  .bottom-nav { display: flex; justify-content: space-around; align-items: center; gap: .5rem;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 30;
    background: #fffaf4; border-top: 1px solid var(--color-border); padding: .8rem .4rem;
    padding-bottom: max(.8rem, env(safe-area-inset-bottom)); }
  .bottom-nav a { font-size: .9rem; font-weight: 700; text-decoration: none; padding: .3rem; }
  .bottom-nav a.router-link-active { color: var(--color-primary-hover); }
}
</style>
