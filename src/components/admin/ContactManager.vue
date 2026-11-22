<script setup>
import { onMounted, ref } from 'vue'
import { commercialApi } from '../../api/commercialApi'
import { apiMessage } from '../../utils/catalog'

const contacts = ref([])
const error = ref('')
const busy = ref(false)
async function load() {
  error.value = ''
  try { const { data } = await commercialApi.contacts({ page_size: 100 }); contacts.value = data.results || data }
  catch (err) { error.value = apiMessage(err) }
}
async function markHandled(id) {
  busy.value = true; error.value = ''
  try { await commercialApi.markHandled(id); await load() }
  catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template>
  <section class="contacts">
    <h2>Formulários de contato</h2>
    <p>Essas mensagens não geram uma conversa privada. Para acompanhar respostas no site, utilize tickets.</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="!contacts.length">Nenhum contato registrado.</p>
    <article v-for="item in contacts" :key="item.id" class="card">
      <h3>{{ item.subject }}</h3>
      <p><strong>{{ item.name }}</strong> · {{ item.email }}</p>
      <p class="body">{{ item.message }}</p>
      <p>{{ item.handled_at ? 'Tratado' : 'Aguardando atendimento' }}</p>
      <button v-if="!item.handled_at" :disabled="busy" @click="markHandled(item.id)">Marcar como tratado</button>
    </article>
  </section>
</template>
<style scoped>
.contacts { display: grid; gap: 1rem; }
.body { white-space: pre-line; }
</style>
