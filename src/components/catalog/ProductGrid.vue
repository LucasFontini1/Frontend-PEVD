<script setup>
import ProductCard from "./ProductCard.vue";
defineProps({
  products: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
});
</script>
<template>
  <div
    v-if="loading"
    class="product-grid"
    role="status"
    aria-label="Carregando produtos"
  >
    <div v-for="i in 6" :key="i" class="placeholder">
      <div class="image-skeleton"></div>
      <div class="line-skeleton"></div>
      <div class="line-skeleton short"></div>
    </div>
  </div>
  <p v-else-if="error" role="alert" class="error">{{ error }}</p>
  <p v-else-if="!products.length" class="muted">
    Nenhum produto publicado no momento.
  </p>
  <div v-else class="product-grid">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
<style scoped>
.placeholder {
  background: white;
  padding: 0.8rem;
  border-radius: 18px;
}
.image-skeleton,
.line-skeleton {
  background: linear-gradient(90deg, #f3e3e8 20%, #fff7fa 50%, #f3e3e8 80%);
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
  border-radius: 10px;
}
.image-skeleton {
  aspect-ratio: 1;
}
.line-skeleton {
  height: 18px;
  margin-top: 1rem;
}
.line-skeleton.short {
  width: 60%;
}
@keyframes shimmer {
  to {
    background-position-x: -200%;
  }
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr));
  gap: 1.5rem;
}
</style>
