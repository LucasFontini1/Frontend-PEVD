<script setup>
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'
import { useBrandStore } from '../../stores/brandStore'
import { imageUrl } from '../../utils/catalog'
const brand = useBrandStore()
const auth = useAuthStore()
const router = useRouter()
async function logout() { await auth.logout(); await router.push('/') }
</script>
<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <div class="topbar">
    <div class="container top-inner">
      <span>♡ Doces para tornar seus momentos mais especiais</span>
      <span v-if="brand.brand.phone">Atendimento: {{ brand.brand.phone }}</span>
      <RouterLink to="/atendimento">Dúvidas frequentes</RouterLink>
    </div>
  </div>
  <header class="header">
    <nav class="container nav" aria-label="Navegação principal">
      <RouterLink to="/" class="brand">
        <img v-if="imageUrl(brand.brand.logo)" :src="imageUrl(brand.brand.logo)" alt="" class="logo" />
        <span v-else aria-hidden="true" class="brand-icon">♡</span>
        <span>{{ brand.brand.name }}</span>
      </RouterLink>
      <div class="links">
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/cardapio">Cardápio</RouterLink>
        <RouterLink to="/encomendas-personalizadas">Personalizados</RouterLink>
        <RouterLink to="/atendimento">Atendimento</RouterLink>
        <RouterLink to="/tutorial">Como usar</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/meus-pedidos">Meus pedidos</RouterLink>
        <RouterLink v-if="auth.user?.is_superuser" to="/admin">Painel</RouterLink>
      </div>
      <div class="right">
        <RouterLink v-if="!auth.isAuthenticated" class="account" to="/entrar">Entrar</RouterLink>
        <button v-else class="account" @click="logout">Sair</button>
        <RouterLink to="/carrinho" class="cart-link">♡ Carrinho</RouterLink>
      </div>
    </nav>
  </header>
</template>
<style scoped>
.topbar { background: linear-gradient(95deg,#e85d94,#c9417b); color: white; font-size: .77rem; }
.top-inner { min-height: 31px; display: flex; gap: 1.2rem; justify-content: space-between; align-items: center; }
.topbar a { color: white; font-weight: 700; text-decoration: none; }
.header { position: sticky; top: 0; z-index: 20; background: #fffdfbeF;
  backdrop-filter: blur(14px); border-bottom: 1px solid var(--color-border); }
.nav { min-height: 85px; display: flex; align-items: center; justify-content: space-between; gap: 1.4rem; }
.brand { display: inline-flex; align-items: center; gap: .65rem; font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.15rem,2vw,1.45rem); font-weight: 800; color: var(--color-heading); text-decoration: none; }
.brand-icon { color: var(--color-primary); background: #ffe2ec; font-size: 1.6rem;
  height: 39px; width: 39px; border-radius: 13px; text-align: center; }
.logo { height: 47px; max-width: 70px; object-fit: contain; }
.links,.right { display: flex; align-items: center; gap: clamp(.6rem,1.5vw,1.3rem); }
.links a,.account { font-size: .88rem; font-weight: 700; color: var(--color-heading); text-decoration: none; }
.links .router-link-active { color: var(--color-primary-hover); }
.account { border: 0; background: transparent; padding: .5rem; }
.cart-link { text-decoration: none; font-weight: 800; background: var(--color-primary);
  color: white; border-radius: 12px; padding: .65rem 1rem; font-size: .88rem; }
.skip { position: absolute; transform: translateY(-150%); background: white; padding: 1rem; z-index: 30; }
.skip:focus { transform: translateY(0); }
@media(max-width: 1040px) { .links { gap: .6rem; } .nav { gap: .6rem; } .links a { font-size: .8rem; } }
@media(max-width: 800px) { .links { display: none; } .top-inner span:first-child { display: none; } }
@media(max-width: 600px) { .nav { min-height: 67px; } .topbar a { display: none; } .brand { max-width: 210px; } .brand span:last-child { font-size: 1rem; } }
</style>
