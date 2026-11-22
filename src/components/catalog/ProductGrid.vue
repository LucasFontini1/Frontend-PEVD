<script setup>
import ProductCard from './ProductCard.vue'
defineProps({
  products: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
</script>
<template>
  <p v-if="loading" role="status">Carregando produtos...</p>
  <p v-else-if="error" role="alert" class="error">{{ error }}</p>
  <p v-else-if="!products.length" class="muted">Nenhum produto publicado no momento.</p>
  <div v-else class="product-grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>
<style scoped>
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); gap: 1.5rem; }
</style>
