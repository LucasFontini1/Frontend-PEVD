<script setup>
import { useAuthStore } from '../stores/authStore'
import FAQList from '../components/support/FAQList.vue'
const auth = useAuthStore()
</script>
<template>
  <section class="page">
    <h1>Como podemos ajudar?</h1>
    <p>Encontre respostas no FAQ ou envie uma dúvida para nossa equipe.</p>
    <FAQList />
    <section class="card">
      <h2>Não encontrou sua resposta?</h2>
      <p>Você pode nos enviar uma mensagem pelo formulário de contato.</p>
      <RouterLink class="button" to="/contato">Falar com a loja</RouterLink>
      <p v-if="auth.isAuthenticated">
        <RouterLink to="/atendimento/duvidas">Acompanhar minhas dúvidas</RouterLink>
      </p>
      <p v-else>
        <RouterLink to="/entrar?redirect=/atendimento/duvidas">Entrar para acompanhar atendimento</RouterLink>
      </p>
      <p><RouterLink to="/encomendas-personalizadas">Solicitar orçamento personalizado</RouterLink></p>
    </section>
  </section>
</template>
<style scoped>
.page { display: grid; gap: 2rem; padding: 2.5rem 0; }
</style>
