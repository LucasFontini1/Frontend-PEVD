<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import MobileNav from './components/layout/MobileNav.vue'
import { onMounted } from 'vue'
import { useBrandStore } from './stores/brandStore'
import { useAuthStore } from './stores/authStore'
const brand = useBrandStore()
const auth = useAuthStore()
onMounted(() => { brand.load(); auth.hydrate() })
</script>
<template>
  <AppHeader />
  <main class="container" id="conteudo"><RouterView /></main>
  <AppFooter />
  <MobileNav />
</template>
