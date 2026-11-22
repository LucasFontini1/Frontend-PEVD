<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalogApi } from '../api/catalogApi'
import { apiMessage, currency, imageUrl } from '../utils/catalog'

const route = useRoute()
const product = ref(null)
const loading = ref(false)
const error = ref('')
async function load() {
  loading.value = true; error.value = ''; product.value = null
  try { product.value = (await catalogApi.product(route.params.slug)).data }
  catch (err) { error.value = apiMessage(err) }
  finally { loading.value = false }
}
onMounted(load)
watch(() => route.params.slug, load)
</script>
<template>
  <section class="detail">
    <RouterLink to="/cardapio">Voltar ao cardápio</RouterLink>
    <p v-if="loading" role="status">Carregando detalhes...</p>
    <p v-else-if="error" role="alert" class="error">{{ error }}</p>
    <div v-else-if="product" class="detail-grid">
      <div>
        <div v-if="!product.images.length" class="no-image">Fotos ainda não cadastradas</div>
        <div v-else class="photos">
          <img v-for="photo in product.images" :key="photo.id" :src="imageUrl(photo.image)" :alt="photo.alt_text" />
        </div>
      </div>
      <div class="details">
        <p class="muted">{{ product.category.name }}</p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ currency(product.effective_price) }} / {{ product.unit }}</p>
        <p>{{ product.description }}</p>
        <p v-if="!product.is_available" class="error">Temporariamente indisponível</p>
        <p><strong>Quantidade mínima:</strong> {{ product.minimum_quantity }}</p>
        <p><strong>Antecedência mínima:</strong> {{ product.minimum_lead_hours }} horas</p>
        <p v-if="product.ingredients"><strong>Ingredientes:</strong> {{ product.ingredients }}</p>
        <p v-if="product.allergen_info"><strong>Alergênicos:</strong> {{ product.allergen_info }}</p>
        <p v-if="product.conservation_info"><strong>Conservação:</strong> {{ product.conservation_info }}</p>
        <section v-for="group in product.option_groups" :key="group.id">
          <h2>{{ group.name }}</h2>
          <p v-if="group.required" class="muted">Escolha obrigatória ao encomendar</p>
          <p v-for="option in group.options" :key="option.id">{{ option.name }} — + {{ currency(option.additional_price) }}</p>
        </section>
        <p class="muted">Pedidos online serão habilitados na Fase 3.</p>
      </div>
    </div>
  </section>
</template>
<style scoped>
.detail { padding-block: 2rem; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; padding-top: 2rem; }
.photos { display: grid; gap: 1rem; }
.photos img { width: 100%; border-radius: 1rem; background: #f2e5d6; }
.no-image { background: #f4e4d8; border-radius: 1rem; aspect-ratio: 4/3; display: grid; place-items: center; }
.price { font-size: 1.5rem; color: var(--color-primary-hover); font-weight: 800; }
@media(max-width: 760px) { .detail-grid { grid-template-columns: 1fr; } }
</style>
