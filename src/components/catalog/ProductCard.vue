<script setup>
import { computed } from 'vue'
import { currency, imageUrl } from '../../utils/catalog'
const props = defineProps({ product: { type: Object, required: true } })
const cover = computed(() => imageUrl(props.product.images?.[0]?.image))
</script>
<template>
  <article class="product-card">
    <RouterLink :to="`/produto/${product.slug}`">
      <div class="product-photo">
        <img v-if="cover" :src="cover" :alt="product.images[0].alt_text" loading="lazy" />
        <span v-else class="missing-image">Foto ainda não cadastrada</span>
      </div>
      <div class="details">
        <p class="category">{{ product.category.name }}</p>
        <h3>{{ product.name }}</h3>
        <p class="price">{{ currency(product.effective_price) }} <small>/ {{ product.unit }}</small></p>
        <span v-if="!product.is_available" class="muted">Temporariamente indisponível</span>
      </div>
    </RouterLink>
  </article>
</template>
<style scoped>
.product-card { background: white; border: 1px solid var(--color-border); border-radius: var(--radius-card); overflow: hidden; box-shadow: var(--shadow-card); }
.product-card a { text-decoration: none; display: block; }
.product-photo { aspect-ratio: 4/3; background: #f4e4d8; display: grid; place-items: center; overflow: hidden; }
.product-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .25s; }
.product-card:hover img { transform: scale(1.04); }
.missing-image { font-size: .9rem; color: #65574e; text-align: center; }
.details { padding: 1rem 1.2rem; }
.category { color: var(--color-primary-hover); font-size: .85rem; }
h3 { margin: .3rem 0; }
.price { font-weight: 800; }
.price small { font-weight: 400; }
</style>
