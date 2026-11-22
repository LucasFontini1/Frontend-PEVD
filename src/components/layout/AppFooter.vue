<script setup>
import { useBrandStore } from '../../stores/brandStore'
const brand = useBrandStore()
</script>
<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <strong class="footer-brand">♡ {{ brand.brand.name }}</strong>
        <p>Um doce carinho para cada ocasião.</p>
        <p>Descubra nossos produtos e consulte as opções disponíveis para encomenda.</p>
      </div>
      <nav aria-label="Links do site" class="footer-links">
        <strong>Explore</strong>
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/cardapio">Cardápio</RouterLink>
        <RouterLink to="/encomendas-personalizadas">Orçamento personalizado</RouterLink>
      </nav>
      <nav aria-label="Atendimento" class="footer-links">
        <strong>Atendimento</strong>
        <RouterLink to="/atendimento">Perguntas frequentes</RouterLink>
        <RouterLink to="/tutorial">Como usar o site</RouterLink>
        <RouterLink to="/contato">Contato</RouterLink>
        <RouterLink to="/meus-pedidos">Meus pedidos</RouterLink>
      </nav>
      <div class="footer-links">
        <strong>Informações da loja</strong>
        <span v-if="brand.brand.phone">Telefone: {{ brand.brand.phone }}</span>
        <span v-if="brand.brand.business_email">E-mail: {{ brand.brand.business_email }}</span>
        <span v-if="brand.brand.pickup_address">Retirada: {{ brand.brand.pickup_address }}</span>
        <span v-if="brand.brand.response_hours !== null">Prazo de resposta informado: até {{ brand.brand.response_hours }} horas</span>
        <a v-if="brand.brand.instagram_url" :href="brand.brand.instagram_url" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
    <div class="container copyright">© {{ new Date().getFullYear() }} {{ brand.brand.name }} · Feito com carinho ♡</div>
  </footer>
</template>
<style scoped>
.footer { background: #fff0f5; padding: 3rem 0 5.5rem; border-top: 1px solid var(--color-border); margin-top: 3.5rem; }
.footer-grid { display: grid; grid-template-columns: 1.4fr repeat(3, 1fr); gap: 2rem; }
.footer-brand { font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; color: var(--color-primary-hover); }
.footer p { color: #796774; font-size: .9rem; max-width: 290px; }
.footer-links { display: flex; flex-direction: column; gap: .6rem; font-size: .88rem; color: #796774; }
.footer-links strong { color: var(--color-heading); font-weight: 800; margin-bottom: .4rem; }
.footer-links a { color: inherit; text-decoration: none; }
.footer-links a:hover { color: var(--color-primary-hover); text-decoration: underline; }
.copyright { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eaceD9; font-size: .75rem; color: #917684; }
@media(max-width: 800px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
@media(max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
</style>
