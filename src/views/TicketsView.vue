<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supportApi } from '../api/supportApi'
import { orderApi } from '../api/orderApi'
import { apiMessage } from '../utils/catalog'

const router = useRouter()
const tickets = ref([])
const orders = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const form = reactive({ subject: '', message: '', order_public_id: '' })
async function load() {
  loading.value = true; error.value = ''
  try {
    const [t, o] = await Promise.all([supportApi.tickets(), orderApi.orders()])
    tickets.value = t.data.results || t.data
    orders.value = o.data.results || o.data
  } catch (err) { error.value = apiMessage(err) }
  finally { loading.value = false }
}
async function create() {
  saving.value = true; error.value = ''
  try {
    const { data } = await supportApi.newTicket({
      subject: form.subject, message: form.message,
      ...(form.order_public_id ? { order_public_id: form.order_public_id } : {}),
    })
    await router.push(`/atendimento/duvidas/${data.id}`)
  } catch (err) { error.value = apiMessage(err) }
  finally { saving.value = false }
}
onMounted(load)
</script>
<template>
  <section class="page">
    <h1>Minhas dúvidas</h1>
    <p v-if="loading" role="status">Buscando atendimentos...</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <form class="card form" @submit.prevent="create">
      <h2>Abrir uma dúvida</h2>
      <label class="field">Assunto<input v-model.trim="form.subject" required minlength="4" maxlength="180" /></label>
      <label class="field">Mensagem<textarea v-model.trim="form.message" required minlength="5" maxlength="4000" rows="4" /></label>
      <label class="field">Relacionar a pedido (opcional)
        <select v-model="form.order_public_id">
          <option value="">Sem pedido relacionado</option>
          <option v-for="order in orders" :key="order.public_id" :value="order.public_id">
            Pedido {{ order.public_id.slice(0, 8) }}
          </option>
        </select>
      </label>
      <p class="muted">Acompanhe sua pergunta e as respostas nesta área privada.</p>
      <button class="button" :disabled="saving">{{ saving ? 'Enviando...' : 'Abrir atendimento' }}</button>
    </form>
    <section>
      <h2>Atendimentos existentes</h2>
      <p v-if="!tickets.length && !loading">Nenhuma dúvida aberta anteriormente.</p>
      <div v-for="ticket in tickets" :key="ticket.id" class="card ticket">
        <div><strong>{{ ticket.subject }}</strong><p>Status: {{ ticket.status }}</p></div>
        <RouterLink :to="`/atendimento/duvidas/${ticket.id}`">Ver conversa</RouterLink>
      </div>
    </section>
  </section>
</template>
<style scoped>
.page { display: grid; gap: 2rem; padding: 2rem 0; }
.form { display: grid; gap: .8rem; }
textarea, select { padding: .75rem; border: 1px solid var(--color-border); border-radius: 8px; }
.ticket { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin: 1rem 0; }
</style>
