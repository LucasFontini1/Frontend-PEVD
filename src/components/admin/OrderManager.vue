<script setup>
import { computed, onMounted, ref } from 'vue'
import { orderApi } from '../../api/orderApi'
import { apiMessage, currency } from '../../utils/catalog'
const orders = ref([])
const search = ref('')
const state = ref('')
const view = ref('list')
const filtered = computed(() => orders.value.filter(order => {
  const text = `${order.customer_name || ''} ${order.customer_phone || ''} ${order.public_id || ''}`
    .toLocaleLowerCase('pt-BR')
  return (!search.value || text.includes(search.value.toLocaleLowerCase('pt-BR'))) &&
    (!state.value || order.status === state.value)
}))
const error = ref('')
const busy = ref(false)
const reason = ref('')
import ManualOrderForm from './ManualOrderForm.vue'
import CompletedOrdersReport from './CompletedOrdersReport.vue'
const allowed = {
  aguardando_confirmacao: ['confirmado', 'rejeitado', 'cancelado'],
  confirmado: ['em_preparo', 'cancelado'],
  em_preparo: ['pronto'],
  pronto: ['concluido'],
}
const statuses = [
  ['confirmado', 'Confirmar'],
  ['rejeitado', 'Rejeitar'],
  ['em_preparo', 'Em preparo'],
  ['pronto', 'Pronto'],
  ['concluido', 'Concluir'],
  ['cancelado', 'Cancelar'],
]
function availableTransitions(order) { return statuses.filter(([status]) => (allowed[order.status] || []).includes(status)) }
async function load() {
  error.value = ''
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
    <h2>Gestão de pedidos</h2>
    <nav class="section-nav" aria-label="Funções de pedidos">
      <button :aria-pressed="view === 'list'" @click="view = 'list'">Pedidos</button>
      <button :aria-pressed="view === 'manual'" @click="view = 'manual'">Novo pedido WhatsApp</button>
      <button :aria-pressed="view === 'report'" @click="view = 'report'">Relatório de concluídos</button>
    </nav>
    <ManualOrderForm v-if="view === 'manual'" @created="load(); view = 'list'" />
    <CompletedOrdersReport v-else-if="view === 'report'" />
    <template v-else>
    <div class="filters">
      <label class="field">Pesquisar por cliente, telefone ou código
        <input v-model.trim="search" type="search" placeholder="Nome ou código do pedido" />
      </label>
      <label class="field">Situação
        <select v-model="state">
          <option value="">Todas</option>
          <option value="aguardando_confirmacao">Aguardando</option>
          <option value="confirmado">Confirmado</option>
          <option value="em_preparo">Em preparo</option>
          <option value="pronto">Pronto</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
          <option value="rejeitado">Rejeitado</option>
        </select>
      </label>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="!orders.length && !error && view === 'list'">Nenhum pedido registrado.</p>
    <label class="field">Motivo ou observação da ação<input v-model.trim="reason" maxlength="200" /></label>
    <article v-for="order in filtered" :key="order.public_id" class="card">
      <h3>Pedido {{ order.public_id.slice(0, 8) }}</h3>
      <p><strong>{{ order.customer_name || 'Cliente da plataforma' }}</strong>
        <span v-if="order.customer_phone"> · {{ order.customer_phone }}</span>
        · Origem: {{ order.source === 'whatsapp' ? 'WhatsApp' : 'Site' }}</p>
      <p>{{ order.status.replaceAll('_', ' ') }} | Pagamento: {{ order.payment_status }}</p>
      <p><strong>{{ currency(order.total) }}</strong> — {{ order.fulfillment_type }}</p>
      <p>{{ new Date(order.scheduled_at).toLocaleString('pt-BR') }}</p>
      <p v-for="(item, i) in order.items" :key="i">{{ item.quantity }} × {{ item.product_name_snapshot }}</p>
      <div class="buttons">
        <button v-for="[status, label] in availableTransitions(order)" type="button" class="button-outline" :key="status" :disabled="busy" @click="transition(order.id, status)">{{ label }}</button>
        <button type="button" class="button" v-if="order.payment_status === 'pendente' && !['rejeitado', 'cancelado'].includes(order.status)" :disabled="busy" @click="markPaid(order.id)">Confirmar pagamento manual</button>
      </div>
    </article>
    <p v-if="!filtered.length && orders.length">Nenhum pedido corresponde à busca.</p>
    </template>
  </section>
</template>
<style scoped>
.manager { display: grid; gap: 1rem; }
.section-nav,.filters { display: flex; gap: .6rem; flex-wrap: wrap; }
.section-nav button { border: 1px solid var(--color-border); border-radius: 11px; padding: .7rem 1rem; }
.section-nav button[aria-pressed=true] { background: var(--color-primary); color: #fff; }
.buttons { display: flex; flex-wrap: wrap; gap: .5rem; }
.buttons button { padding: .5rem; cursor: pointer; }
</style>
