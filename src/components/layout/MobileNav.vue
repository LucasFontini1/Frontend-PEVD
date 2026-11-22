<script setup>
import { useAuthStore } from "../../stores/authStore";
const auth = useAuthStore();
</script>
<template>
  <nav class="bottom-nav" aria-label="Navegação móvel">
    <RouterLink to="/"
      ><i class="mdi mdi-home-outline" aria-hidden="true"></i>Início</RouterLink
    >
    <RouterLink to="/cardapio"
      ><i class="mdi mdi-view-grid-outline" aria-hidden="true"></i
      >Cardápio</RouterLink
    >
    <RouterLink to="/carrinho" class="cart"
      ><i class="mdi mdi-heart-outline" aria-hidden="true"></i
      >Carrinho</RouterLink
    >
    <RouterLink to="/tutorial"
      ><i class="mdi mdi-help-circle-outline" aria-hidden="true"></i
      >Ajuda</RouterLink
    >
    <RouterLink v-if="auth.user?.is_superuser" to="/admin"
      ><i class="mdi mdi-cog-outline" aria-hidden="true"></i>Painel</RouterLink
    >
    <RouterLink v-else-if="auth.isAuthenticated" to="/meus-pedidos"
      ><i class="mdi mdi-account-outline" aria-hidden="true"></i
      >Pedidos</RouterLink
    >
    <RouterLink v-else to="/entrar"
      ><i class="mdi mdi-account-outline" aria-hidden="true"></i
      >Conta</RouterLink
    >
  </nav>
</template>
<style scoped>
.bottom-nav {
  display: none;
}
@media (max-width: 800px) {
  .bottom-nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 0.2rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 30;
    background: #fffdfb;
    border-top: 1px solid var(--color-border);
    padding: 0.65rem 0.5rem max(0.7rem, env(safe-area-inset-bottom));
  }
  .bottom-nav a {
    display: grid;
    justify-items: center;
    gap: 0.1rem;
    font-size: 0.72rem;
    font-weight: 800;
    text-decoration: none;
    color: #725a68;
    min-width: 48px;
  }
  .bottom-nav .mdi {
    font-size: 1.5rem;
    line-height: 1.3;
  }
  .bottom-nav .cart .mdi {
    color: white;
    background: var(--color-primary);
    border-radius: 50%;
    width: 37px;
    height: 37px;
    display: grid;
    place-items: center;
  }
  .bottom-nav a.router-link-active {
    color: var(--color-primary-hover);
  }
}
</style>
