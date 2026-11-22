<script setup>
import { onMounted, ref } from 'vue'
import { orderApi } from '../../api/orderApi'
import { apiMessage, currency } from '../../utils/catalog'
const orders = ref([])
const error = ref('')
const busy = ref(false)
const reason = ref('')
const statuses = [
  ['confirmado', 'Confirmar'],
  ['rejeitado', 'Rejeitar'],
  ['em_preparo', 'Em preparo'],
  ['pronto', 'Pronto'],
  ['concluido', 'Concluir'],
  ['cancelado', 'Cancelar'],
]
async function load() {
  try {
    const { data } = await orderApi.adminOrders({ page_size: 100 })
    orders.value = data.results || data
  } catch (err) { error.value = apiMessage(err) }
}
async function transition(id, status) {
  if (!confirm('Confirmar mudança do status deste pedido?')) return
  busy.value = true; error.value = ''
  try { await orderApi.adminTransition(id, status, reason.value); reason.value = ''; await load() }
  catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
async function markPaid(id) {
  if (!reason.value.trim()) { error.value = 'Informe uma justificativa para pagamento confirmado.'; return }
  if (!confirm('Confirma que recebeu o pagamento fora do site?')) return
  busy.value = true; error.value = ''
  try { await orderApi.adminPayment(id, reason.value); reason.value = ''; await load() }
  catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template>
  <section class="manager">
    <h2>Pedidos recebidos</h2>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="!orders.length && !error">Nenhum pedido registrado.</p>
    <label class="field">Motivo ou observação da ação<input v-model.trim="reason" maxlength="200" /></label>
    <article v-for="order in orders" :key="order.public_id" class="card">
      <h3>Pedido {{ order.public_id }}</h3>
      <p>{{ order.status.replaceAll('_', ' ') }} | Pagamento: {{ order.payment_status }}</p>
      <p><strong>{{ currency(order.total) }}</strong> — {{ order.fulfillment_type }}</p>
      <p>{{ new Date(order.scheduled_at).toLocaleString('pt-BR') }}</p>
      <p v-for="(item, i) in order.items" :key="i">{{ item.quantity }} × {{ item.product_name_snapshot }}</p>
      <div class="buttons">
        <button v-for="[status, label] in statuses" :key="status" :disabled="busy" @click="transition(order.id, status)">{{ label }}</button>
        <button v-if="order.payment_status === 'pendente'" :disabled="busy" @click="markPaid(order.id)">Confirmar pagamento manual</button>
      </div>
    </article>
  </section>
</template>
<style scoped>
.manager { display: grid; gap: 1rem; }
.buttons { display: flex; flex-wrap: wrap; gap: .5rem; }
.buttons button { padding: .5rem; cursor: pointer; }
</style>
