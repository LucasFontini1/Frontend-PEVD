<script setup>
import { onMounted, ref, watch } from "vue";
import { adminCatalogApi } from "../../api/adminCatalogApi";
import { apiMessage, imageUrl } from "../../utils/catalog";
import ImageCropInput from "../layout/ImageCropInput.vue";

const props = defineProps({ productId: { type: Number, required: true } });
const photos = ref([]);
const file = ref(null);
const altText = ref("");
const error = ref("");
const busy = ref(false);
async function reload() {
  try {
    const { data } = await adminCatalogApi.list("product-images", {
      page_size: 100,
    });
    photos.value = (data.results || data).filter(
      (x) => x.product === props.productId,
    );
  } catch (err) {
    error.value = apiMessage(err);
  }
}
onMounted(reload);
watch(() => props.productId, reload);
async function upload() {
  if (!file.value || !altText.value) return;
  busy.value = true;
  error.value = "";
  try {
    const { data } = await adminCatalogApi.upload(file.value);
    await adminCatalogApi.create("product-images", {
      product: props.productId,
      image_attachment_key: data.attachment_key,
      alt_text: altText.value,
    });
    file.value = null;
    altText.value = "";
    await reload();
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    busy.value = false;
  }
}
async function remove(id) {
  if (!confirm("Remover esta imagem da galeria?")) return;
  try {
    await adminCatalogApi.disable("product-images", id);
    await reload();
  } catch (err) {
    error.value = apiMessage(err);
  }
}
</script>
<template>
  <section class="card">
    <h3>Galeria do produto</h3>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div class="photos">
      <div v-for="photo in photos" :key="photo.id">
        <img :src="imageUrl(photo.image)" :alt="photo.alt_text" />
        <p>{{ photo.alt_text }}</p>
        <button type="button" @click="remove(photo.id)">Remover</button>
      </div>
    </div>
    <form @submit.prevent="upload">
      <ImageCropInput v-model="file" label="Imagem do produto" :aspect-ratio="1" />
      <label class="field"
        >Descrição acessível<input
          v-model.trim="altText"
          required
          maxlength="220"
      /></label>
      <button class="button" :disabled="busy">
        {{ busy ? "Enviando..." : "Adicionar foto" }}
      </button>
    </form>
  </section>
</template>
<style scoped>
.photos {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.photos > div {
  max-width: 160px;
}
.photos img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}
</style>
