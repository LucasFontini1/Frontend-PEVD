<script setup>
import { onMounted, reactive, ref } from 'vue'
import { orderApi } from '../../api/orderApi'
import { apiMessage } from '../../utils/catalog'
const error = ref('')
const success = ref('')
const hours = ref([])
const zones = ref([])
const blocks = ref([])
const hour = reactive({
  weekday: 0, opens_at: '09:00', closes_at: '17:00',
  pickup_enabled: true, delivery_enabled: false,
})
const zone = reactive({ name: '', zip_prefix: '', fee: '', minimum_order: '0.00', is_active: true })
const block = reactive({ date: '', reason: '' })
async function load() {
  try {
    const [a, b, c] = await Promise.all([
      orderApi.businessHours(), orderApi.deliveryZones(), orderApi.blockedDates(),
    ])
    hours.value = a.data.results || a.data
    zones.value = b.data.results || b.data
    blocks.value = c.data.results || c.data
  } catch (err) { error.value = apiMessage(err) }
}
async function save(action, payload) {
  error.value = ''; success.value = ''
  try {
    await action({ ...payload })
    success.value = 'Configuração gravada.'
    await load()
  } catch (err) { error.value = apiMessage(err) }
}
onMounted(load)
</script>
<template>
  <section class="settings">
    <h2>Agenda e entrega</h2>
    <p>Sem horários de atendimento configurados, pedidos não podem ser realizados.</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="success" role="status">{{ success }}</p>
    <form class="card" @submit.prevent="save(orderApi.createBusinessHour, hour)">
      <h3>Adicionar janela de atendimento</h3>
      <label class="field">Dia da semana (0=segunda)
        <select v-model.number="hour.weekday">
          <option v-for="n in 7" :key="n" :value="n - 1">{{ n - 1 }}</option>
        </select>
      </label>
      <label class="field">Abre<input v-model="hour.opens_at" type="time" required /></label>
      <label class="field">Fecha<input v-model="hour.closes_at" type="time" required /></label>
      <label><input v-model="hour.pickup_enabled" type="checkbox" /> Retirada</label>
      <label><input v-model="hour.delivery_enabled" type="checkbox" /> Entrega</label>
      <button class="button">Adicionar horário</button>
      <p v-for="item in hours" :key="item.id">{{ item.weekday }}: {{ item.opens_at }}–{{ item.closes_at }}</p>
    </form>
    <form class="card" @submit.prevent="save(orderApi.createDeliveryZone, zone)">
      <h3>Adicionar região de entrega</h3>
      <label class="field">Nome<input v-model.trim="zone.name" required /></label>
      <label class="field">Prefixo CEP<input v-model.trim="zone.zip_prefix" required maxlength="8" /></label>
      <label class="field">Taxa R$<input v-model="zone.fee" type="number" min="0" step=".01" required /></label>
      <label class="field">Mínimo R$<input v-model="zone.minimum_order" type="number" min="0" step=".01" required /></label>
      <button class="button">Adicionar região</button>
      <p v-for="item in zones" :key="item.id">{{ item.name }} — CEP {{ item.zip_prefix }} — taxa R$ {{ item.fee }}</p>
    </form>
    <form class="card" @submit.prevent="save(orderApi.createBlockedDate, block)">
      <h3>Bloquear data</h3>
      <label class="field">Data<input v-model="block.date" type="date" required /></label>
      <label class="field">Motivo<input v-model.trim="block.reason" /></label>
      <button class="button">Bloquear</button>
      <p v-for="item in blocks" :key="item.id">{{ item.date }} — {{ item.reason }}</p>
    </form>
  </section>
</template>
<style scoped>
.settings { display: grid; gap: 1rem; }
.settings form { display: grid; gap: .8rem; }
.settings input, .settings select { padding: .5rem; }
.settings form { max-width: 850px; }
.settings form > p { padding: .5rem .9rem; border-radius: 10px; background: var(--color-soft); margin: .1rem 0; }
.settings form > button { justify-self: start; }
.settings form > label:not(.field) { display: flex; align-items: center; gap: .6rem; }
</style>
