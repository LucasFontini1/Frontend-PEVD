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
  <header class="header">
    <nav class="container nav" aria-label="Navegação principal">
      <RouterLink to="/" class="brand"><img v-if="imageUrl(brand.brand.logo)" :src="imageUrl(brand.brand.logo)" alt="" class="logo" />{{ brand.brand.name }}</RouterLink>
      <div class="links">
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/cardapio">Cardápio</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/entrar">Entrar</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/cadastro">Criar conta</RouterLink>
        <RouterLink v-if="auth.user?.is_superuser" to="/admin">Admin</RouterLink>
        <button v-if="auth.isAuthenticated" class="signout" @click="logout">Sair</button>
      </div>
    </nav>
  </header>
</template>
<style scoped>
.header { position: sticky; top: 0; z-index: 20; background: #fffaf4; border-bottom: 1px solid var(--color-border); }
.nav { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: .7rem; padding: .8rem 0; }
.brand { color: var(--color-heading); font-size: 1.3rem; font-weight: 800; text-decoration: none; }
.logo { max-height: 40px; width: auto; max-width: 80px; object-fit: contain; }
.brand { display: inline-flex; gap: .6rem; align-items: center; }
.links { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
.signout { border: 0; background: transparent; color: var(--color-heading); cursor: pointer; text-decoration: underline; }
.skip { position: absolute; transform: translateY(-150%); background: white; padding: 1rem; z-index: 30; }
.skip:focus { transform: translateY(0); }
@media(max-width: 520px) { .links { width: 100%; justify-content: space-between; font-size: .88rem; } }
</style>
