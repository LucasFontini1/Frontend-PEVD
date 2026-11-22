<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { commercialApi } from '../../api/commercialApi'
import { apiMessage } from '../../utils/catalog'
const faqs = ref([])
const editorElement = ref(null)
const search = ref('')
const visible = computed(() => faqs.value.filter(faq =>
  faq.question.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))))
const current = ref(null)
const form = reactive({ question: '', answer: '', sort_order: 0, published: false })
const error = ref('')
const busy = ref(false)
async function load() {
  error.value = ''
  try { const { data } = await commercialApi.faqs(); faqs.value = data.results || data }
  catch (err) { error.value = apiMessage(err) }
}
async function edit(faq) {
  current.value = faq
  Object.assign(form, faq)
  await nextTick()
  editorElement.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function reset() {
  current.value = null
  Object.assign(form, { question: '', answer: '', sort_order: 0, published: false })
}
async function save() {
  busy.value = true; error.value = ''
  try {
    if (current.value) await commercialApi.updateFaq(current.value.id, { ...form })
    else await commercialApi.createFaq({ ...form })
    reset(); await load()
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
async function unpublish(id) {
  if (!confirm('Retirar esta pergunta da página pública?')) return
  try { await commercialApi.unpublishFaq(id); await load() }
  catch (err) { error.value = apiMessage(err) }
}
onMounted(load)
</script>
<template>
  <section class="manager">
    <h2>Perguntas frequentes</h2>
    <p class="muted">Publique somente informações confirmadas pela proprietária.</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <form ref="editorElement" class="card form editor" @submit.prevent="save">
      <h3>{{ current ? 'Editar pergunta' : 'Nova pergunta' }}</h3>
      <label class="field">Pergunta<input v-model.trim="form.question" maxlength="240" required /></label>
      <label class="field">Resposta<textarea v-model.trim="form.answer" rows="4" required /></label>
      <label class="field">Ordem<input v-model.number="form.sort_order" type="number" min="0" /></label>
      <label><input v-model="form.published" type="checkbox" /> Publicar no site</label>
      <div class="actions">
        <button class="button" :disabled="busy">{{ busy ? 'Salvando...' : 'Salvar pergunta' }}</button>
        <button v-if="current" type="button" @click="reset">Cancelar edição</button>
      </div>
    </form>
    <label class="field">Pesquisar pergunta para editar
      <input v-model.trim="search" type="search" placeholder="Nome ou conteúdo da pergunta" />
    </label>
    <article v-for="faq in visible" :key="faq.id" class="card">
      <h3>{{ faq.question }}</h3>
      <p>{{ faq.answer }}</p>
      <p class="muted">{{ faq.published ? 'Publicada' : 'Rascunho' }}</p>
      <div class="actions">
        <button type="button" class="button-outline" @click="edit(faq)">Editar</button>
        <button v-if="faq.published" type="button" class="button-danger" @click="unpublish(faq.id)">Despublicar</button>
      </div>
    </article>
  </section>
</template>
<style scoped>
.manager, .form { display: grid; gap: 1rem; }
.editor { scroll-margin-top: 115px; }
textarea { padding: .75rem; border: 1px solid var(--color-border); border-radius: 8px; }
.actions { display: flex; gap: .8rem; flex-wrap: wrap; }
</style>
