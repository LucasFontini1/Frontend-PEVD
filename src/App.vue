<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>
<template>
  <AppHeader />
  <main class="container" id="conteudo"><RouterView /></main>
  <AppFooter />
</template>
