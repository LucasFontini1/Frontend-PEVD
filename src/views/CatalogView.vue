<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useCatalogStore } from "../stores/catalogStore";
import ProductGrid from "../components/catalog/ProductGrid.vue";

const route = useRoute();
const catalog = useCatalogStore();
const search = ref("");
const ordering = ref("sort_order");
const onlyAvailable = ref(false);
const page = ref(1);
const category = computed(() => route.params.slug || "");
async function load() {
  await catalog.loadProducts({
    category: category.value || undefined,
    search: search.value || undefined,
    ordering: ordering.value,
    available: onlyAvailable.value ? "true" : undefined,
    page: page.value,
  });
}
watch([category, ordering, onlyAvailable], () => {
  page.value = 1;
  load();
});
watch(page, load);
onMounted(async () => {
  try {
    await catalog.loadCategories();
  } catch {
    /* list still loads */
  }
  await load();
});
</script>
<template>
  <section class="section">
    <div class="catalog-intro">
      <span class="section-eyebrow">Escolha seu doce favorito</span>
      <h1>{{ category ? "Produtos da categoria" : "Nosso cardápio" }}</h1>
      <p>
        Explore as opções disponíveis para tornar seu momento mais especial.
      </p>
    </div>
    <form
      class="filters"
      @submit.prevent="
        page = 1;
        load();
      "
    >
      <label
        >Buscar produto<input v-model.trim="search" placeholder="Nome do doce"
      /></label>
      <label
        >Ordenar por
        <select v-model="ordering">
          <option value="sort_order">Destaques da loja</option>
          <option value="name">Nome (A–Z)</option>
          <option value="price">Menor preço</option>
          <option value="-price">Maior preço</option>
        </select>
      </label>
      <label class="checkbox"
        ><input v-model="onlyAvailable" type="checkbox" /> Disponíveis</label
      >
      <button class="button" type="submit">Buscar</button>
    </form>
    <nav class="categories" aria-label="Filtrar categorias">
      <RouterLink to="/cardapio">Todas</RouterLink>
      <RouterLink
        v-for="item in catalog.categories"
        :key="item.id"
        :to="`/categoria/${item.slug}`"
        >{{ item.name }}</RouterLink
      >
    </nav>
    <ProductGrid
      :products="catalog.products"
      :loading="catalog.loading"
      :error="catalog.error"
    />
    <nav v-if="catalog.totalPages > 1" class="pages" aria-label="Paginação">
      <button :disabled="page <= 1" @click="page--">Anterior</button>
      <span>Página {{ page }} de {{ catalog.totalPages }}</span>
      <button :disabled="page >= catalog.totalPages" @click="page++">
        Próxima
      </button>
    </nav>
  </section>
</template>
<style scoped>
.section {
  padding: 2rem 0;
}
.catalog-intro {
  text-align: center;
  background: linear-gradient(120deg, #fff0f6, #fff1e5);
  border-radius: 24px;
  padding: 2rem 1rem;
}
.catalog-intro h1 {
  margin: 0.4rem 0;
  font-size: clamp(2.1rem, 4vw, 3.6rem);
}
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1rem;
  margin-block: 1.5rem;
  padding: 1.3rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 18px;
}
.filters label {
  display: grid;
  gap: 0.4rem;
  font-weight: 700;
}
.filters input:not([type="checkbox"]),
.filters select {
  padding: 0.65rem;
}
.checkbox {
  display: flex !important;
  flex-direction: row;
  align-items: center;
}
.categories {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}
.categories a {
  background: white;
  border: 1px solid var(--color-border);
  padding: 0.65rem 0.95rem;
  border-radius: 100px;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 800;
}
.categories a.router-link-active {
  background: var(--color-primary);
  color: white;
}
.pages {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  padding: 2rem;
}
.pages button {
  padding: 0.6rem 1rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}
@media (max-width: 580px) {
  .filters label {
    width: 100%;
  }
}
</style>
