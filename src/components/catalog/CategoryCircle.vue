<script setup>
import { computed } from "vue";
import { imageUrl } from "../../utils/catalog";
const props = defineProps({ category: { type: Object, required: true } });
const cover = computed(() => imageUrl(props.category.image));
</script>
<template>
  <RouterLink class="category" :to="`/categoria/${category.slug}`">
    <span class="photo">
      <img
        v-if="cover"
        :src="cover"
        :alt="`Categoria ${category.name}`"
        loading="lazy"
      />
      <span v-else aria-hidden="true">♡</span>
    </span>
    <strong>{{ category.name }}</strong>
  </RouterLink>
</template>
<style scoped>
.category {
  text-align: center;
  display: grid;
  gap: 0.8rem;
  text-decoration: none;
  min-width: 132px;
  font-size: 0.93rem;
}
.category strong {
  color: var(--color-heading);
}
.photo {
  border-radius: 50%;
  background: linear-gradient(145deg, #f6cadb, #ffedf2);
  width: clamp(105px, 14vw, 154px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: #ba537c;
  font-size: 3.5rem;
  overflow: hidden;
  margin: auto;
  border: 6px solid white;
  box-shadow: 0 9px 24px #b4738833;
  transition: transform 0.2s;
}
.category:hover .photo {
  transform: translateY(-5px);
}
.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
