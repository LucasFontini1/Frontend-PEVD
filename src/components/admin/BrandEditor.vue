<script setup>
import { onMounted, reactive, ref } from 'vue'
import { brandApi } from '../../api/brandApi'
import { adminCatalogApi } from '../../api/adminCatalogApi'
import { useBrandStore } from '../../stores/brandStore'
import { apiMessage, imageUrl } from '../../utils/catalog'

const brandStore = useBrandStore()
const form = reactive({
  name: '', background_color: '#FFF5E9', primary_color: '#C96680', heading_color: '#704438',
})
const logo = ref(null)
const preview = ref(null)
const busy = ref(false)
const error = ref('')
const success = ref('')
onMounted(async () => {
  try {
    const { data } = await brandApi.adminGet()
    Object.assign(form, data)
    preview.value = imageUrl(data.logo)
  } catch (err) { error.value = apiMessage(err) }
})
async function submit() {
  busy.value = true; error.value = ''; success.value = ''
  try {
    const payload = { ...form }
    if (logo.value) {
      const { data } = await adminCatalogApi.upload(logo.value)
      payload.logo_attachment_key = data.attachment_key
    }
    await brandApi.update(payload)
    await brandStore.load()
    preview.value = imageUrl(brandStore.brand.logo)
    logo.value = null
    success.value = 'Identidade visual atualizada.'
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
</script>
<template>
  <form class="card brand-editor" @submit.prevent="submit">
    <h2>Identidade visual</h2>
    <label class="field">Nome da loja<input v-model.trim="form.name" maxlength="120" required /></label>
    <label class="field">Cor de fundo<input v-model="form.background_color" type="color" /></label>
    <label class="field">Cor dos botões<input v-model="form.primary_color" type="color" /></label>
    <label class="field">Cor dos títulos<input v-model="form.heading_color" type="color" /></label>
    <img v-if="preview" class="logo-preview" :src="preview" alt="Logo atual da loja" />
    <label class="field">Nova logo<input type="file" accept="image/png,image/jpeg,image/webp" @change="logo = $event.target.files[0]" /></label>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="success" role="status">{{ success }}</p>
    <button class="button" :disabled="busy">{{ busy ? 'Salvando...' : 'Salvar identidade' }}</button>
  </form>
</template>
<style scoped>
.brand-editor { max-width: 570px; }
.brand-editor input[type=color] { width: 80px; height: 42px; border: 1px solid var(--color-border); border-radius: 8px; }
.logo-preview { max-width: 180px; max-height: 100px; object-fit: contain; }
</style>
