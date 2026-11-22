<script setup>
import { computed, onMounted, ref } from "vue";
import { useCatalogStore } from "../stores/catalogStore";
import { useBrandStore } from "../stores/brandStore";
import { imageUrl } from "../utils/catalog";
import CategoryCircle from "../components/catalog/CategoryCircle.vue";
import ProductGrid from "../components/catalog/ProductGrid.vue";
import FAQList from "../components/support/FAQList.vue";
import HomeBanners from "../components/storefront/HomeBanners.vue";

const brand = useBrandStore();
const catalog = useCatalogStore();
const categoryError = ref("");
const spotlightImage = computed(() => imageUrl(brand.brand.hero_image));
onMounted(async () => {
  try {
    await catalog.loadCategories();
  } catch {
    categoryError.value = "Não foi possível carregar as categorias.";
  }
  await catalog.loadProducts({ featured: "true", page_size: 8 });
});
</script>
<template>
  <p v-if="brand.brand.announcement" class="announcement backend-text">
    {{ brand.brand.announcement }}
  </p>
  <section class="hero">
    <div class="hero-content">
      <span class="section-eyebrow"
        ><i class="mdi mdi-heart-outline" aria-hidden="true"></i> Pensamos em
        cada detalhe</span
      >
      <h1>Um doce carinho <em>para você.</em></h1>
      <p>
        Descubra sabores especiais no nosso cardápio. Escolha seus favoritos e
        encomende pelo site.
      </p>
      <div class="hero-actions">
        <RouterLink to="/cardapio" class="button"
          >Explorar cardápio
          <i class="mdi mdi-arrow-right" aria-hidden="true"></i
        ></RouterLink>
        <RouterLink to="/encomendas-personalizadas" class="outline"
          >Encomenda especial</RouterLink
        >
      </div>
      <div class="hero-details">
        <span
          ><b><i class="mdi mdi-heart-outline" aria-hidden="true"></i></b> Feito
          com carinho</span
        >
        <span
          ><b><i class="mdi mdi-flower-outline" aria-hidden="true"></i></b> Para
          momentos especiais</span
        >
      </div>
    </div>
    <div class="hero-art">
      <div v-if="spotlightImage" class="hero-photo">
        <img
          :src="spotlightImage"
          alt="Imagem principal da Pensei em Você Doces"
        />
      </div>
      <div
        v-else
        class="hero-placeholder"
        aria-label="Ilustração de confeitaria"
      >
        <span aria-hidden="true"><i class="mdi mdi-heart-outline"></i></span
        ><span aria-hidden="true"><i class="mdi mdi-flower-outline"></i></span>
        <strong>Um mundo mais doce</strong>
      </div>
      <span aria-hidden="true" class="sparkle one"
        ><i class="mdi mdi-star-four-points-outline"></i
      ></span>
      <span aria-hidden="true" class="sparkle two"
        ><i class="mdi mdi-flower-outline"></i
      ></span>
    </div>
  </section>
  <HomeBanners />
  <section class="section">
    <div class="section-head">
      <span class="section-eyebrow">Escolha seu favorito</span>
      <h2>Delícias por categoria</h2>
      <p>Explore os sabores disponíveis na nossa confeitaria.</p>
    </div>
    <p v-if="categoryError" role="alert">{{ categoryError }}</p>
    <p v-else-if="!catalog.categories.length" class="empty-state">
      Categorias ainda não publicadas.
    </p>
    <div v-else class="categories">
      <CategoryCircle
        v-for="item in catalog.categories"
        :key="item.id"
        :category="item"
      />
    </div>
  </section>
  <section class="section">
    <div class="section-title">
      <div>
        <span class="section-eyebrow">Uma seleção especial</span>
        <h2>Doces em destaque</h2>
      </div>
      <RouterLink to="/cardapio" class="see-all"
        >Ver cardápio completo →</RouterLink
      >
    </div>
    <div class="home-products">
      <ProductGrid
        :products="catalog.products"
        :loading="catalog.loading"
        :error="catalog.error"
      />
    </div>
  </section>
  <section class="special">
    <div>
      <span class="section-eyebrow">Seu momento merece mais</span>
      <h2>
        Uma encomenda com a sua cara
        <i class="mdi mdi-heart-outline" aria-hidden="true"></i>
      </h2>
      <p>
        Conte sua ideia para a nossa equipe avaliar um orçamento personalizado.
      </p>
      <RouterLink class="button" to="/encomendas-personalizadas"
        >Pedir orçamento</RouterLink
      >
    </div>
    <span aria-hidden="true" class="special-icon"
      ><i class="mdi mdi-cake-variant-outline"></i
    ></span>
  </section>
  <section class="section faq-area">
    <div>
      <span class="section-eyebrow">Precisa de ajuda?</span>
      <h2>Estamos por aqui</h2>
      <p>Veja as respostas publicadas pela loja ou envie sua pergunta.</p>
      <RouterLink class="outline" to="/atendimento"
        >Falar com a loja</RouterLink
      >
    </div>
    <FAQList />
  </section>
</template>
<style scoped>
.announcement {
  margin: 0.8rem 0 0;
  text-align: center;
  padding: 0.65rem;
  background: #ffe6ef;
  color: #8d3259;
  border-radius: 12px;
}
.hero {
  margin-top: 1.5rem;
  padding: clamp(2rem, 5vw, 4.2rem);
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 2rem;
  align-items: center;
  background:
    radial-gradient(circle at 80% 25%, #ffdaea 0, transparent 40%),
    linear-gradient(125deg, #fff2e8, #ffedf4);
  border-radius: 28px;
  overflow: hidden;
  min-height: 455px;
}
.hero h1 {
  max-width: 570px;
  margin: 0.7rem 0 1.3rem;
}
.hero h1 em {
  display: block;
  color: var(--color-primary);
  font-style: italic;
}
.hero p {
  max-width: 440px;
  font-size: 1.05rem;
}
.hero-actions,
.hero-details {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
}
.hero-actions {
  margin: 1.6rem 0 2rem;
}
.outline {
  display: inline-flex;
  padding: 0.75rem 1.2rem;
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  text-decoration: none;
  color: var(--color-primary-hover);
  font-weight: 800;
}
.hero-details {
  font-size: 0.78rem;
  font-weight: 800;
  color: #8c6478;
}
.hero-details b {
  color: var(--color-primary);
  font-size: 1.3rem;
  margin-right: 0.2rem;
}
.hero-art {
  position: relative;
  width: 100%;
  min-height: 360px;
  display: grid;
  place-items: center;
}
.hero-photo {
  display: block;
  width: min(100%, 420px);
  aspect-ratio: 1/1;
  border-radius: 50%;
  border: 15px solid #fff9;
  overflow: hidden;
  box-shadow: 0 25px 45px #bd6b8738;
  position: relative;
}
.hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-label {
  position: absolute;
  bottom: 20px;
  left: 15%;
  right: 15%;
  text-align: center;
  padding: 0.4rem 0.7rem;
  border-radius: 15px;
  background: #fffdfbed;
  color: #733e55;
  font-weight: 700;
  font-size: 0.88rem;
}
.hero-placeholder {
  width: min(100%, 360px);
  aspect-ratio: 1;
  border-radius: 50%;
  border: 15px solid #ffffffad;
  box-shadow: 0 20px 40px #ba81932a;
  background: radial-gradient(circle, #ffbccc, #f69ac0);
  display: grid;
  align-content: center;
  justify-items: center;
  color: white;
}
.hero-placeholder span:nth-child(1) {
  font-size: 3rem;
}
.hero-placeholder span:nth-child(2) {
  font-size: 6rem;
}
.hero-placeholder strong {
  font-size: 1.1rem;
}
.sparkle {
  position: absolute;
  color: #ec7fa2;
  font-size: 2.8rem;
}
.one {
  top: 0;
  right: 4%;
}
.two {
  bottom: 12%;
  left: 1%;
}
.section-head {
  text-align: center;
  margin-bottom: 2rem;
}
.section-head h2 {
  margin: 0.4rem 0;
}
.categories {
  display: flex;
  gap: clamp(1rem, 2.4vw, 2.2rem);
  overflow-x: auto;
  justify-content: center;
  padding: 0.5rem 0 1.5rem;
}
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1.6rem;
}
.section-title h2 {
  margin: 0.35rem 0;
}
.see-all {
  font-weight: 800;
  text-decoration: none;
}
.special {
  margin: 2rem 0;
  padding: clamp(2rem, 5vw, 3.5rem);
  border-radius: 26px;
  background: linear-gradient(105deg, #ffdbe9, #f6a8c5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.special h2 {
  max-width: 550px;
  margin: 0.6rem 0;
}
.special-icon {
  font-size: clamp(5rem, 13vw, 10rem);
  line-height: 1;
}
.faq-area {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 3rem;
}
@media (max-width: 800px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2rem;
  }
  .hero-art {
    min-height: 240px;
  }
  .hero-photo,
  .hero-placeholder {
    width: min(100%, 280px);
  }
  .categories {
    justify-content: flex-start;
  }
  .faq-area {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
@media (max-width: 520px) {
  .hero {
    margin: 0.5rem -1rem 0;
    border-radius: 0 0 25px 25px;
  }
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-actions a {
    width: 100%;
    justify-content: center;
  }
  .special-icon {
    display: none;
  }
  .section-title {
    align-items: start;
    flex-direction: column;
  }
}
@media (width < 600px) {
  .home-products :deep(.product-grid > :nth-child(n + 4)) {
    display: none;
  }
}
</style>
