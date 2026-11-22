<script setup>
import { useBrandStore } from '../../stores/brandStore'
const brand = useBrandStore()
</script>
<template>
  <footer class="footer"><div class="container">
    <strong>{{ brand.brand.name }}</strong>
    <p>Confeitaria artesanal. Informações comerciais e cardápio serão publicados após confirmação.</p>
  </div></footer>
</template>
<style scoped>
.footer { margin-top: 4rem; padding: 2rem 0 5rem; border-top: 1px solid var(--color-border); }
</style>
