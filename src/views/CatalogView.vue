<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '../stores/catalogStore'
import ProductGrid from '../components/catalog/ProductGrid.vue'

const route = useRoute()
const catalog = useCatalogStore()
const search = ref('')
const ordering = ref('sort_order')
const onlyAvailable = ref(false)
const page = ref(1)
const category = computed(() => route.params.slug || '')
async function load() {
  await catalog.loadProducts({
    category: category.value || undefined, search: search.value || undefined,
    ordering: ordering.value, available: onlyAvailable.value ? 'true' : undefined,
    page: page.value,
  })
}
watch([category, ordering, onlyAvailable], () => { page.value = 1; load() })
watch(page, load)
onMounted(async () => { try { await catalog.loadCategories() } catch { /* list still loads */ }; await load() })
</script>
<template>
  <section class="section">
    <h1>{{ category ? 'Produtos da categoria' : 'Nosso cardápio' }}</h1>
    <form class="filters" @submit.prevent="page = 1; load()">
      <label>Buscar produto<input v-model.trim="search" placeholder="Nome do doce" /></label>
      <label>Ordenar por
        <select v-model="ordering">
          <option value="sort_order">Destaques da loja</option>
          <option value="name">Nome (A–Z)</option>
          <option value="price">Menor preço</option>
          <option value="-price">Maior preço</option>
        </select>
      </label>
      <label class="checkbox"><input v-model="onlyAvailable" type="checkbox" /> Disponíveis</label>
      <button class="button" type="submit">Buscar</button>
    </form>
    <nav class="categories" aria-label="Filtrar categorias">
      <RouterLink to="/cardapio">Todas</RouterLink>
      <RouterLink v-for="item in catalog.categories" :key="item.id" :to="`/categoria/${item.slug}`">{{ item.name }}</RouterLink>
    </nav>
    <ProductGrid :products="catalog.products" :loading="catalog.loading" :error="catalog.error" />
    <nav v-if="catalog.totalPages > 1" class="pages" aria-label="Paginação">
      <button :disabled="page <= 1" @click="page--">Anterior</button>
      <span>Página {{ page }} de {{ catalog.totalPages }}</span>
      <button :disabled="page >= catalog.totalPages" @click="page++">Próxima</button>
    </nav>
  </section>
</template>
<style scoped>
.section { padding: 2rem 0; }
.filters { display: flex; flex-wrap: wrap; align-items: end; gap: 1rem; margin-block: 1.5rem; }
.filters label { display: grid; gap: .4rem; }
.filters input:not([type=checkbox]), .filters select { padding: .65rem; border: 1px solid #a48d80; border-radius: 8px; }
.checkbox { display: flex !important; flex-direction: row; align-items: center; }
.categories { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
.pages { display: flex; justify-content: center; gap: 1rem; align-items: center; padding: 2rem; }
.pages button { padding: .5rem 1rem; }
</style>
