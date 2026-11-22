<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { catalogApi } from '../api/catalogApi'
import AddToCartForm from '../components/cart/AddToCartForm.vue'
import { apiMessage, currency, imageUrl } from '../utils/catalog'
import { toast } from '../utils/feedback'

const route = useRoute()
const product = ref(null)
const loading = ref(false)
const error = ref('')
async function load() {
  loading.value = true; error.value = ''; product.value = null
  try { product.value = (await catalogApi.product(route.params.slug)).data }
  catch (err) { error.value = apiMessage(err); toast(error.value, 'error') }
  finally { loading.value = false }
}
onMounted(load)
watch(() => route.params.slug, load)
</script>
<template>
  <section class="detail">
    <RouterLink class="back" to="/cardapio">← Voltar ao cardápio</RouterLink>
    <div v-if="loading" class="detail-grid" role="status" aria-label="Carregando produto"><div class="skeleton skeleton-image"></div><div class="card"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-line" v-for="i in 5" :key="i"></div></div></div>
    <p v-else-if="error" role="alert" class="error">{{ error }}</p>
    <div v-else-if="product" class="detail-grid">
      <div>
        <div v-if="!product.images.length" class="no-image">Fotos ainda não cadastradas</div>
        <div v-else class="photos">
          <img v-for="photo in product.images" :key="photo.id" :src="imageUrl(photo.image)" :alt="photo.alt_text" />
        </div>
      </div>
      <div class="details card">
        <p class="section-eyebrow">{{ product.category.name }}</p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ currency(product.effective_price) }} / {{ product.unit }}</p>
        <p>{{ product.description }}</p>
        <p v-if="!product.is_available" class="error">Temporariamente indisponível</p>
        <p><strong>Quantidade mínima:</strong> {{ product.minimum_quantity }}</p>
        <p><strong>Antecedência mínima:</strong> {{ product.minimum_lead_hours }} horas</p>
        <p v-if="product.ingredients"><strong>Ingredientes:</strong> {{ product.ingredients }}</p>
        <p v-if="product.allergen_info"><strong>Alergênicos:</strong> {{ product.allergen_info }}</p>
        <p v-if="product.conservation_info"><strong>Conservação:</strong> {{ product.conservation_info }}</p>
        <section v-for="group in product.option_groups.filter(group => !/extra/i.test(group.name))" :key="group.id">
          <h2>{{ group.name }}</h2>
          <p v-if="group.required" class="muted">Escolha obrigatória ao encomendar</p>
          <p v-for="option in group.options" :key="option.id">{{ option.name }} — + {{ currency(option.additional_price) }}</p>
        </section>
        <AddToCartForm :product="{ ...product, option_groups: product.option_groups.filter(group => !/extra/i.test(group.name)) }" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.detail { padding: 2rem 0 3rem; }
.skeleton { background: linear-gradient(90deg, #f3e4e5 25%,#fff7f7 50%,#f3e4e5 75%); background-size: 200% 100%; animation: shimmer 1.3s infinite; border-radius: 12px; }
.skeleton-image { aspect-ratio: 1; }
.skeleton-title { height: 36px; width: 70%; margin-bottom: 2rem; }
.skeleton-line { height: 18px; margin: 1rem 0; }
@keyframes shimmer { to { background-position-x: -200%; } }
.back { font-weight: 800; text-decoration: none; }
.detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0,1fr); gap: 2rem; padding-top: 2rem; align-items: start; }
.photos { display: grid; gap: 1rem; }
.photos img { width: 100%; border-radius: 19px; background: #fce4e9; box-shadow: var(--shadow-card); }
.no-image { background: linear-gradient(135deg,#fce2eb,#ffece1); border-radius: 22px;
  aspect-ratio: 4/3; display: grid; place-items: center; font-weight: 700; color: #a95b7a; }
.details h1 { font-size: clamp(2rem,4vw,3.4rem); margin: .5rem 0 1rem; }
.details h2 { font-size: 1.2rem; }
.details section { border-top: 1px solid var(--color-border); padding-block: .7rem; }
.price { font-size: 1.7rem; color: var(--color-primary-hover); font-weight: 800; }
@media(max-width: 760px) { .detail-grid { grid-template-columns: 1fr; } }
</style>
