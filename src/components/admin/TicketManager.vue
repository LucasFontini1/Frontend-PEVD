<script setup>
import { computed, onMounted, ref } from 'vue'
import { commercialApi } from '../../api/commercialApi'
import { apiMessage } from '../../utils/catalog'

const tickets = ref([])
const search = ref('')
const visible = computed(() => tickets.value.filter(item =>
  item.subject.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))))
const selected = ref(null)
const reply = ref('')
const closeAfter = ref(false)
const statusFilter = ref('')
const error = ref('')
const busy = ref(false)
async function load() {
  error.value = ''
  try {
    const { data } = await commercialApi.tickets({
      page_size: 100, ...(statusFilter.value ? { status: statusFilter.value } : {}),
    })
    tickets.value = data.results || data
    if (selected.value) selected.value = tickets.value.find(t => t.id === selected.value.id) || null
  } catch (err) { error.value = apiMessage(err) }
}
async function send() {
  if (!selected.value) return
  busy.value = true; error.value = ''
  try {
    selected.value = (await commercialApi.reply(selected.value.id, reply.value, closeAfter.value)).data
    reply.value = ''; closeAfter.value = false
    await load()
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
async function close() {
  if (!selected.value || !confirm('Encerrar este atendimento?')) return
  busy.value = true; error.value = ''
  try { await commercialApi.closeTicket(selected.value.id); selected.value = null; await load() }
  catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template>
  <section class="manager">
    <h2>Atendimentos de clientes</h2>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <label class="field">Filtrar por estado
      <select v-model="statusFilter" @change="load">
        <option value="">Todos</option>
        <option value="aberto">Aberto</option>
        <option value="respondido">Respondido</option>
        <option value="encerrado">Encerrado</option>
      </select>
    </label>
    <label class="field">Pesquisar atendimento pelo assunto
      <input v-model.trim="search" type="search" placeholder="Assunto" />
    </label>
    <p v-if="!visible.length">Nenhum atendimento encontrado.</p>
    <div v-for="ticket in visible" :key="ticket.id" class="card summary">
      <div><strong>{{ ticket.subject }}</strong><p>{{ ticket.status }} · Cliente #{{ ticket.user }}</p></div>
      <button @click="selected = ticket">Abrir conversa</button>
    </div>
    <section v-if="selected" class="card conversation">
      <h3>{{ selected.subject }}</h3>
      <p v-for="message in selected.messages" :key="message.id">
        <strong>Conta #{{ message.sender }}:</strong> {{ message.body }}
      </p>
      <form v-if="selected.status !== 'encerrado'" @submit.prevent="send">
        <label class="field">Responder cliente
          <textarea v-model.trim="reply" required maxlength="4000" rows="4" />
        </label>
        <label><input v-model="closeAfter" type="checkbox" /> Encerrar após resposta</label>
        <button class="button" :disabled="busy || !reply">Enviar resposta</button>
        <button type="button" :disabled="busy" @click="close">Encerrar sem resposta</button>
      </form>
      <p v-else>Atendimento encerrado.</p>
    </section>
  </section>
</template>
<style scoped>
.manager, .conversation, form { display: grid; gap: 1rem; }
.summary { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
textarea, select { padding: .75rem; border: 1px solid var(--color-border); border-radius: 8px; }
.conversation p { white-space: pre-line; }
</style>
