<script setup>
import { reactive, ref, watch } from 'vue'
import { adminCatalogApi } from '../../api/adminCatalogApi'
import { apiMessage } from '../../utils/catalog'

const props = defineProps({ selected: { type: Object, default: null } })
const emit = defineEmits(['saved', 'cancel'])
const form = reactive({ name: '', slug: '', description: '', sort_order: 0, is_active: true })
const busy = ref(false)
const error = ref('')
const selectedFile = ref(null)
watch(() => props.selected, value => {
  Object.assign(form, {
    name: value?.name || '', slug: value?.slug || '', description: value?.description || '',
    sort_order: value?.sort_order || 0, is_active: value?.is_active ?? true,
  })
  selectedFile.value = null
}, { immediate: true })
async function submit() {
  error.value = ''; busy.value = true
  try {
    const payload = { ...form }
    if (selectedFile.value) {
      const { data } = await adminCatalogApi.upload(selectedFile.value)
      payload.image_attachment_key = data.attachment_key
    }
    if (props.selected) await adminCatalogApi.update('categories', props.selected.id, payload)
    else await adminCatalogApi.create('categories', payload)
    emit('saved')
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
</script>
<template>
  <form class="card editor" @submit.prevent="submit">
    <h3>{{ selected ? 'Editar categoria' : 'Nova categoria' }}</h3>
    <label class="field">Nome<input v-model.trim="form.name" required maxlength="120" /></label>
    <label class="field">Slug (URL)<input v-model.trim="form.slug" required pattern="[a-z0-9-]+" /></label>
    <label class="field">Descrição<textarea v-model.trim="form.description" rows="3" /></label>
    <label class="field">Ordem<input v-model.number="form.sort_order" type="number" min="0" /></label>
    <label class="field">Imagem da categoria<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="selectedFile = $event.target.files[0]" /></label>
    <label><input v-model="form.is_active" type="checkbox" /> Categoria ativa</label>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div class="actions">
      <button class="button" :disabled="busy">{{ busy ? 'Salvando...' : 'Salvar categoria' }}</button>
      <button type="button" @click="emit('cancel')">Cancelar</button>
    </div>
  </form>
</template>
<style scoped>
.editor { max-width: 520px; }
.editor textarea { padding: .7rem; border: 1px solid var(--color-border); border-radius: 8px; resize: vertical; }
.actions { display: flex; align-items: center; gap: 1rem; margin-top: 1.2rem; }
</style>
