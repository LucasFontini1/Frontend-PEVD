<script setup>
import { computed } from "vue";
import { useBrandStore } from "../../stores/brandStore";
const brand = useBrandStore();
const phone = computed(() => brand.brand.phone || "+55 47 9667-5064");
const instagram = computed(
  () =>
    brand.brand.instagram_url || "https://www.instagram.com/penseiemvocedoces/",
);
const whatsapp = computed(
  () => "https://wa.me/" + phone.value.replace(/\D/g, ""),
);
</script>
<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-intro">
        <strong class="footer-brand"
          ><i class="mdi mdi-heart-outline" aria-hidden="true"></i>
          {{ brand.brand.name }}</strong
        >
        <p>Um doce carinho para cada ocasião.</p>
        <p>
          Descubra nossos produtos e consulte as opções disponíveis para
          encomenda.
        </p>
        <p class="location">
          <i class="mdi mdi-map-marker-outline" aria-hidden="true"></i>
          Joinville – SC
        </p>
      </div>
      <nav aria-label="Links do site" class="footer-links">
        <strong>Explore</strong>
        <RouterLink to="/">Início</RouterLink>
        <RouterLink to="/cardapio">Cardápio</RouterLink>
        <RouterLink to="/encomendas-personalizadas"
          >Orçamento personalizado</RouterLink
        >
      </nav>
      <nav aria-label="Atendimento" class="footer-links">
        <strong>Atendimento</strong>
        <RouterLink to="/atendimento">Perguntas frequentes</RouterLink>
        <RouterLink to="/tutorial">Como usar o site</RouterLink>
        <RouterLink to="/contato">Contato</RouterLink>
        <RouterLink to="/meus-pedidos">Meus pedidos</RouterLink>
        <RouterLink to="/termos-de-uso">Termos de Uso</RouterLink>
        <RouterLink to="/politica-de-privacidade">Política de Privacidade</RouterLink>
      </nav>
      <div class="footer-links">
        <strong>Fale com a loja</strong>
        <a
          :href="whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="contact"
        >
          <i class="mdi mdi-whatsapp" aria-hidden="true"></i> WhatsApp:
          {{ phone }}
        </a>
        <a
          :href="instagram"
          target="_blank"
          rel="noopener noreferrer"
          class="contact"
        >
          <i class="mdi mdi-instagram" aria-hidden="true"></i>
          @penseiemvocedoces
        </a>
        <span class="contact"
          ><i class="mdi mdi-map-marker-outline" aria-hidden="true"></i>
          Joinville – Santa Catarina</span
        >
        <a
          v-if="brand.brand.business_email"
          :href="'mailto:' + brand.brand.business_email"
        >
          <i class="mdi mdi-email-outline" aria-hidden="true"></i>
          {{ brand.brand.business_email }}
        </a>
        <span v-if="brand.brand.pickup_address"
          >Retirada: {{ brand.brand.pickup_address }}</span
        >
        <span v-if="brand.brand.response_hours !== null"
          >Prazo de resposta: até {{ brand.brand.response_hours }} horas</span
        >
      </div>
    </div>
    <div class="container copyright">
      © {{ new Date().getFullYear() }} {{ brand.brand.name }} · Feito com
      carinho <i class="mdi mdi-heart-outline" aria-hidden="true"></i>
    </div>
  </footer>
</template>
<style scoped>
.footer {
  background: #fff0f5;
  padding: 3rem 0 5.5rem;
  border-top: 1px solid var(--color-border);
  margin-top: 3.5rem;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.35fr repeat(3, minmax(0, 1fr));
  gap: 2rem;
}
.footer-brand {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-primary-hover);
}
.footer-intro p {
  color: #796774;
  font-size: 0.9rem;
  max-width: 290px;
}
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  font-size: 0.9rem;
  color: #796774;
  min-width: 0;
}
.footer-links strong {
  color: var(--color-heading);
  font-weight: 800;
  margin-bottom: 0.4rem;
}
.footer-links a {
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;
}
.footer-links a:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
.contact {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
}
.contact .mdi,
.location .mdi {
  color: var(--color-primary-hover);
  font-size: 1.2rem;
}
.copyright {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eaced9;
  font-size: 0.8rem;
  color: #917684;
}
@media (max-width: 800px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
