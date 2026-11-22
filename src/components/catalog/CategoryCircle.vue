<script setup>
import { computed } from 'vue'
import { imageUrl } from '../../utils/catalog'
const props = defineProps({ category: { type: Object, required: true } })
const cover = computed(() => imageUrl(props.category.image))
</script>
<template>
  <RouterLink class="category" :to="`/categoria/${category.slug}`">
    <span class="photo">
      <img v-if="cover" :src="cover" :alt="`Categoria ${category.name}`" loading="lazy" />
      <span v-else aria-hidden="true">♡</span>
    </span>
    <strong>{{ category.name }}</strong>
  </RouterLink>
</template>
<style scoped>
.category { text-align: center; display: grid; gap: .7rem; text-decoration: none; min-width: 120px; }
.photo { border-radius: 50%; background: #f1d9cf; width: clamp(96px, 20vw, 150px); aspect-ratio: 1; display: grid; place-items: center; color: #704438; font-size: 3rem; overflow: hidden; margin: auto; }
.photo img { width: 100%; height: 100%; object-fit: cover; }
</style>
