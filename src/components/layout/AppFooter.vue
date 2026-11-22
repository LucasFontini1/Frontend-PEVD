<script setup>
import { useBrandStore } from '../../stores/brandStore'
const brand = useBrandStore()
</script>
<template>
  <footer class="footer"><div class="container">
    <strong>{{ brand.brand.name }}</strong>
    <p>Confeitaria artesanal. Consulte o cardápio e converse conosco.</p>
    <p v-if="brand.brand.phone">Telefone: {{ brand.brand.phone }}</p>
    <p v-if="brand.brand.business_email">E-mail: {{ brand.brand.business_email }}</p>
    <p v-if="brand.brand.pickup_address">Retirada: {{ brand.brand.pickup_address }}</p>
    <p v-if="brand.brand.response_hours !== null">Prazo de resposta informado pela loja: até {{ brand.brand.response_hours }} horas.</p>
    <p v-if="brand.brand.instagram_url"><a :href="brand.brand.instagram_url" target="_blank" rel="noopener noreferrer">Instagram</a></p>
    <nav aria-label="Links institucionais"><RouterLink to="/atendimento">Atendimento</RouterLink> · <RouterLink to="/contato">Contato</RouterLink></nav>
  </div></footer>
</template>
<style scoped>
.footer { margin-top: 4rem; padding: 2rem 0 5rem; border-top: 1px solid var(--color-border); }
</style>
