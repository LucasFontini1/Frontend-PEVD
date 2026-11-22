<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { catalogApi } from '../../api/catalogApi'
import { orderApi } from '../../api/orderApi'
import { apiMessage, currency } from '../../utils/catalog'

const emit = defineEmits(['created'])
const products = ref([])
const error = ref('')
const busy = ref(false)
const search = ref('')
let searchTimer = null
let requestId = 0
const idempotencyKey = ref(crypto.randomUUID())
const form = reactive({
  customer_name: '', customer_phone: '', customer_email: '',
  fulfillment_type: 'pickup', scheduled_at: '', notes: '',
  address: { label: 'Entrega', zip_code: '', street: '', number: '',
    complement: '', district: '', city: '', state: 'SC' },
})
const lines = ref([])
const visibleProducts = computed(() => {
  const q = search.value.toLocaleLowerCase('pt-BR').trim()
  return products.value.filter(p => p.is_available &&
    (!q || p.name.toLocaleLowerCase('pt-BR').includes(q)))
})
function add(product) {
  lines.value.push({
    key: crypto.randomUUID(), product_id: product.id, product,
    quantity: Math.max(product.minimum_quantity || 1, 1), selected_option_ids: [],
  })
}
function remove(key) { lines.value = lines.value.filter(line => line.key !== key) }
function selected(id, group) {
  return lines.value.find(line => line.key === id)?.selected_option_ids.filter(optionId =>
    group.options.some(option => option.id === optionId)) || []
}
function choose(line, group, optionId, checked) {
  const groupIds = group.options.map(option => option.id)
  if (group.multiple) {
    line.selected_option_ids = checked
      ? [...line.selected_option_ids, optionId]
      : line.selected_option_ids.filter(id => id !== optionId)
  } else {
    line.selected_option_ids = [
      ...line.selected_option_ids.filter(id => !groupIds.includes(id)),
      ...(checked ? [optionId] : []),
    ]
  }
}
const estimate = computed(() => lines.value.reduce((total, line) => {
  const extra = (line.product.option_groups || []).flatMap(g => g.options || [])
    .filter(option => line.selected_option_ids.includes(option.id))
    .reduce((sum, option) => sum + Number(option.additional_price), 0)
  return total + (Number(line.product.effective_price) + extra) * Number(line.quantity)
}, 0))
async function load() {
  const key = ++requestId
  try {
    const { data } = await catalogApi.products({
      page_size: 100, ...(search.value ? { search: search.value } : {}),
    })
    if (key === requestId) products.value = data.results || data
  } catch (err) {
    if (key === requestId) error.value = apiMessage(err)
  }
}
watch(search, () => { clearTimeout(searchTimer); searchTimer = setTimeout(load, 250) })
async function submit() {
  if (!lines.value.length) { error.value = 'Adicione ao menos um produto.'; return }
  const date = new Date(form.scheduled_at)
  if (!Number.isFinite(date.getTime())) { error.value = 'Informe uma data e hora válidas.'; return }
  busy.value = true
  error.value = ''
  try {
    const payload = {
      customer_name: form.customer_name, customer_phone: form.customer_phone,
      customer_email: form.customer_email,
      fulfillment_type: form.fulfillment_type, scheduled_at: date.toISOString(),
      notes: form.notes, idempotency_key: idempotencyKey.value,
      items: lines.value.map(({ product_id, quantity, selected_option_ids }) => ({
        product_id, quantity, selected_option_ids,
      })),
      ...(form.fulfillment_type === 'delivery' ? { address: { ...form.address } } : {}),
    }
    const { data } = await orderApi.adminManualOrder(payload)
    idempotencyKey.value = crypto.randomUUID()
    lines.value = []
    emit('created', data)
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template>
  <section class="manual card">
    <h2>Registrar pedido do WhatsApp</h2>
    <p class="muted">Para clientes que não conseguem usar o site. O servidor define os preços e o pedido começa com pagamento pendente.</p>
    <form @submit.prevent="submit">
      <div class="form-grid">
        <label class="field">Nome do cliente<input v-model.trim="form.customer_name" required minlength="2" maxlength="160" /></label>
        <label class="field">WhatsApp com DDD<input v-model.trim="form.customer_phone" type="tel" required placeholder="47999999999" /></label>
        <label class="field">E-mail de uma conta existente (opcional)
          <input v-model.trim="form.customer_email" type="email" placeholder="cliente@exemplo.com" /></label>
        <label class="field">Modalidade
          <select v-model="form.fulfillment_type">
            <option value="pickup">Retirada</option>
            <option value="delivery">Entrega</option>
          </select>
        </label>
        <label class="field">Data e hora combinadas
          <input v-model="form.scheduled_at" type="datetime-local" required />
        </label>
      </div>
      <fieldset v-if="form.fulfillment_type === 'delivery'" class="delivery">
        <legend>Endereço informado pelo cliente</legend>
        <div class="form-grid">
          <label class="field">CEP<input v-model.trim="form.address.zip_code" required maxlength="9" /></label>
          <label class="field">Rua<input v-model.trim="form.address.street" required /></label>
          <label class="field">Número<input v-model.trim="form.address.number" required /></label>
          <label class="field">Complemento<input v-model.trim="form.address.complement" /></label>
          <label class="field">Bairro<input v-model.trim="form.address.district" required /></label>
          <label class="field">Cidade<input v-model.trim="form.address.city" required /></label>
          <label class="field">UF<input v-model.trim="form.address.state" required maxlength="2" /></label>
        </div>
      </fieldset>
      <div class="catalog-picker">
        <h3>Produtos da encomenda</h3>
        <label class="field">Pesquisar produto pelo nome
          <input v-model.trim="search" type="search" placeholder="Ex.: brigadeiro" />
        </label>
        <div class="products">
          <button v-for="product in visibleProducts" :key="product.id"
            type="button" class="product-select" @click="add(product)">
            <span>{{ product.name }}</span><strong>{{ currency(product.effective_price) }}</strong><span>+ Adicionar</span>
          </button>
        </div>
      </div>
      <div v-for="line in lines" :key="line.key" class="line card">
        <strong>{{ line.product.name }}</strong>
        <label class="field">Quantidade
          <input v-model.number="line.quantity" type="number" :min="line.product.minimum_quantity" max="100" required />
        </label>
        <fieldset v-for="group in line.product.option_groups" :key="group.id">
          <legend>{{ group.name }} {{ group.required ? '(obrigatório)' : '(opcional)' }}</legend>
          <label v-for="option in group.options" :key="option.id" class="option">
            <input :type="group.multiple ? 'checkbox' : 'radio'" :name="line.key + '-' + group.id"
              :checked="selected(line.key, group).includes(option.id)"
              @change="choose(line, group, option.id, $event.target.checked)" />
            {{ option.name }} (+{{ currency(option.additional_price) }})
          </label>
        </fieldset>
        <button type="button" @click="remove(line.key)">Remover item</button>
      </div>
      <label class="field">Observação do pedido<textarea v-model.trim="form.notes" rows="3" maxlength="1000" /></label>
      <p><strong>Prévia dos produtos: {{ currency(estimate) }}</strong></p>
      <p class="muted">O total definitivo, incluindo entrega, será calculado pelo backend.</p>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <button class="button" :disabled="busy || !lines.length">
        {{ busy ? 'Registrando...' : 'Registrar pedido no sistema' }}
      </button>
    </form>
  </section>
</template>
<style scoped>
.manual form { display: grid; gap: 1rem; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: .5rem 1rem; }
.products { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: .6rem; max-height: 240px; overflow: auto; }
.product-select { background: var(--color-soft); border: 1px solid var(--color-border);
  padding: .7rem; border-radius: 12px; display: grid; text-align: left; }
.product-select span:last-child { color: var(--color-primary-hover); font-weight: 800; }
.delivery,.line { border: 1px solid var(--color-border); border-radius: 12px; }
.line { display: grid; gap: .5rem; }
.option { display: inline-flex; gap: .3rem; margin: .3rem .8rem .3rem 0; }
textarea { min-height: 100px; }
</style>
