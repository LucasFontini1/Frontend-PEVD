<script setup>
import { onMounted, ref } from "vue";
import { supportApi } from "../../api/supportApi";
import { imageUrl } from "../../utils/catalog";
const banners = ref([]);
onMounted(async () => {
  try {
    const { data } = await supportApi.banners();
    banners.value = data.results || data;
  } catch {
    banners.value = [];
  }
});
</script>
<template>
  <section v-if="banners.length" class="banners" aria-label="Novidades da loja">
    <article v-for="item in banners" :key="item.id" class="banner">
      <img
        v-if="imageUrl(item.image)"
        :src="imageUrl(item.image)"
        :alt="item.title"
      />
      <div class="copy">
        <h2>{{ item.title }}</h2>
        <p v-if="item.subtitle" class="backend-text">{{ item.subtitle }}</p>
        <RouterLink class="button" :to="item.link_path"
          >Ver detalhes</RouterLink
        >
      </div>
    </article>
  </section>
</template>
<style scoped>
.banners {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;
}
.banner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1fr;
  gap: 1.5rem;
  align-items: center;
  background: var(--color-surface);
  border-radius: var(--radius-card);
  overflow: hidden;
}
.banner img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}
.copy {
  padding: 1.5rem;
}
@media (max-width: 650px) {
  .banner {
    grid-template-columns: 1fr;
  }
}
</style>
