<script setup>
import { onMounted, ref } from 'vue'
import { useCatalogStore } from '../stores/catalogStore'
import CategoryCircle from '../components/catalog/CategoryCircle.vue'
import ProductGrid from '../components/catalog/ProductGrid.vue'

const catalog = useCatalogStore()
const categoryError = ref('')
onMounted(async () => {
  try { await catalog.loadCategories() }
  catch { categoryError.value = 'Não foi possível carregar as categorias.' }
  await catalog.loadProducts({ featured: 'true', page_size: 8 })
})
</script>
<template>
  <section class="hero">
    <p class="eyebrow">Pensei em Você Doces</p>
    <h1>Doces feitos com carinho para cada ocasião.</h1>
    <p>Explore nosso cardápio artesanal e descubra as opções disponíveis.</p>
    <RouterLink to="/cardapio" class="button">Ver cardápio</RouterLink>
  </section>
  <section class="section">
    <h2>Explore as categorias</h2>
    <p v-if="categoryError" role="alert">{{ categoryError }}</p>
    <p v-else-if="!catalog.categories.length" class="muted">Categorias ainda não publicadas.</p>
    <div v-else class="categories">
      <CategoryCircle v-for="category in catalog.categories" :key="category.id" :category="category" />
    </div>
  </section>
  <section class="section">
    <div class="heading"><h2>Doces em destaque</h2><RouterLink to="/cardapio">Ver tudo</RouterLink></div>
    <ProductGrid :products="catalog.products" :loading="catalog.loading" :error="catalog.error" />
  </section>
</template>
<style scoped>
.hero { padding: clamp(3rem, 8vw, 6rem) 0; max-width: 760px; }
.eyebrow { text-transform: uppercase; letter-spacing: .15em; color: var(--color-primary-hover); font-weight: 700; }
h1 { font-size: clamp(2.2rem, 7vw, 4.4rem); margin: .5rem 0 1rem; }
.hero p { font-size: 1.1rem; }
.section { margin-block: 3rem 4rem; }
.categories { display: flex; gap: 2rem; overflow-x: auto; padding: 1rem 0; }
.heading { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
</style>
