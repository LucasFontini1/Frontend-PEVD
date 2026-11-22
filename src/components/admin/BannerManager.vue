<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { commercialApi } from '../../api/commercialApi'
import { adminCatalogApi } from '../../api/adminCatalogApi'
import { apiMessage, imageUrl } from '../../utils/catalog'

const items = ref([])
const search = ref('')
const visible = computed(() => items.value.filter(item =>
  item.title.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))))
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
    <label class="field">Pesquisar banner pelo título
      <input v-model.trim="search" type="search" placeholder="Título do banner" />
    </label>
    <article v-for="item in visible" :key="item.id" class="card banner-item">
      <div class="banner-photo">
        <img v-if="imageUrl(item.image)" :src="imageUrl(item.image)" :alt="item.title" class="preview" />
        <span v-else class="muted">Sem imagem</span>
      </div>
      <div class="banner-info">
      <h3>{{ item.title }}</h3><p>{{ item.subtitle }}</p>
      <p class="muted">{{ item.link_path }} · <span class="status">{{ item.is_active ? 'Publicado' : 'Rascunho' }}</span></p>
      <div class="actions">
      <button type="button" class="button-outline" @click="edit(item)">Editar</button>
      <button v-if="item.is_active" type="button" class="button-danger" @click="unpublish(item.id)">Despublicar</button>
      </div>
      </div>
    </article>
  </section>
</template>
<style scoped>
.manager, form { display: grid; gap: 1rem; }
.banner-item { display: grid; grid-template-columns: minmax(145px, .45fr) minmax(0, 1fr);
  align-items: center; gap: 1.4rem; }
.banner-photo { aspect-ratio: 4 / 3; border-radius: 16px; display: grid; place-items: center;
  overflow: hidden; background: var(--color-soft); }
.preview { height: 100%; width: 100%; object-fit: contain; }
.banner-info { min-width: 0; }
.banner-info p { overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; gap: .6rem; }
.status { color: var(--color-primary-hover); font-weight: 800; }
@media(max-width: 650px) { .banner-item { grid-template-columns: 1fr; } .banner-photo { max-height: 200px; } }
</style>
