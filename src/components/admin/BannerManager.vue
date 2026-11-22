<script setup>
import { onMounted, reactive, ref } from 'vue'
import { commercialApi } from '../../api/commercialApi'
import { adminCatalogApi } from '../../api/adminCatalogApi'
import { apiMessage, imageUrl } from '../../utils/catalog'

const items = ref([])
const editing = ref(null)
const file = ref(null)
const busy = ref(false)
const error = ref('')
const form = reactive({
  title: '', subtitle: '', link_path: '/cardapio', is_active: false, sort_order: 0,
})
async function load() {
  error.value = ''
  try { const { data } = await commercialApi.banners(); items.value = data.results || data }
  catch (err) { error.value = apiMessage(err) }
}
function edit(item) {
  editing.value = item
  Object.assign(form, { title: item.title, subtitle: item.subtitle,
    link_path: item.link_path, is_active: item.is_active, sort_order: item.sort_order })
}
function reset() {
  editing.value = null
  file.value = null
  Object.assign(form, { title: '', subtitle: '', link_path: '/cardapio', is_active: false, sort_order: 0 })
}
async function save() {
  busy.value = true; error.value = ''
  try {
    const data = { ...form }
    if (file.value) {
      const uploaded = await adminCatalogApi.upload(file.value)
      data.image_attachment_key = uploaded.data.attachment_key
    }
    if (editing.value) await commercialApi.updateBanner(editing.value.id, data)
    else await commercialApi.createBanner(data)
    reset(); await load()
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
async function unpublish(id) {
  if (!confirm('Retirar o banner da vitrine?')) return
  try { await commercialApi.unpublishBanner(id); await load() }
  catch (err) { error.value = apiMessage(err) }
}
onMounted(load)
</script>
<template>
  <section class="manager">
    <h2>Banners da vitrine</h2>
    <p class="muted">Somente banners com imagem e conteúdo autorizado devem ser publicados.</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <form class="card" @submit.prevent="save">
      <h3>{{ editing ? 'Editar banner' : 'Novo banner' }}</h3>
      <label class="field">Título<input v-model.trim="form.title" required maxlength="160" /></label>
      <label class="field">Texto curto<input v-model.trim="form.subtitle" maxlength="220" /></label>
      <label class="field">Rota interna<input v-model.trim="form.link_path" required placeholder="/cardapio" /></label>
      <label class="field">Imagem (opcional)<input type="file" accept="image/jpeg,image/png,image/webp" @change="file = $event.target.files[0]" /></label>
      <label class="field">Ordem<input v-model.number="form.sort_order" type="number" min="0" /></label>
      <label><input v-model="form.is_active" type="checkbox" /> Publicar</label>
      <div><button class="button" :disabled="busy">{{ busy ? 'Salvando...' : 'Salvar banner' }}</button>
        <button v-if="editing" type="button" @click="reset">Cancelar edição</button></div>
    </form>
    <article v-for="item in items" :key="item.id" class="card">
      <img v-if="imageUrl(item.image)" :src="imageUrl(item.image)" :alt="item.title" class="preview" />
      <h3>{{ item.title }}</h3><p>{{ item.subtitle }}</p>
      <p>{{ item.link_path }} · {{ item.is_active ? 'Publicado' : 'Rascunho' }}</p>
      <button @click="edit(item)">Editar</button>
      <button v-if="item.is_active" @click="unpublish(item.id)">Despublicar</button>
    </article>
  </section>
</template>
<style scoped>
.manager, form { display: grid; gap: 1rem; }
.preview { max-height: 150px; width: 100%; object-fit: contain; }
</style>
