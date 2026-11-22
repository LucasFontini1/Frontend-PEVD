<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { orderApi } from '../api/orderApi'
import { apiMessage } from '../utils/catalog'
import AddressForm from '../components/checkout/AddressForm.vue'
import OrderReview from '../components/checkout/OrderReview.vue'

const router = useRouter()
const cart = useCartStore()
const fulfillment = ref('pickup')
const scheduledAt = ref('')
const addressId = ref('')
const addresses = ref([])
const hours = ref([])
const notes = ref('')
const quote = ref(null)
const error = ref('')
const busy = ref(false)
const confirmationKey = ref(crypto.randomUUID())
const canQuote = computed(() => cart.lines.length > 0 && scheduledAt.value &&
  (fulfillment.value === 'pickup' || addressId.value))
const fingerprint = computed(() => JSON.stringify([
  cart.lines, fulfillment.value, scheduledAt.value, addressId.value, notes.value,
]))
watch(fingerprint, () => { quote.value = null; confirmationKey.value = crypto.randomUUID() })
function payload() {
  return {
    items: cart.lines.map(line => ({ ...line })),
    fulfillment_type: fulfillment.value,
    scheduled_at: new Date(scheduledAt.value).toISOString(),
    ...(fulfillment.value === 'delivery' ? { address_id: Number(addressId.value) } : {}),
    notes: notes.value,
  }
}
async function load() {
  try {
    const [a, h] = await Promise.all([orderApi.addresses(), orderApi.schedule()])
    addresses.value = a.data.results || a.data
    hours.value = h.data
  } catch (err) { error.value = apiMessage(err) }
}
async function review() {
  busy.value = true; error.value = ''; quote.value = null
  try { quote.value = (await orderApi.quote(payload())).data }
  catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
async function confirm() {
  if (!quote.value) return
  busy.value = true; error.value = ''
  try {
    const { data } = await orderApi.submit({
      ...payload(), idempotency_key: confirmationKey.value, quote_hash: quote.value.quote_hash,
    })
    cart.clear()
    await router.replace(`/pedido-confirmado/${data.public_id}`)
  } catch (err) {
    quote.value = null
    error.value = apiMessage(err) + ' Revise novamente os valores antes de confirmar.'
  } finally { busy.value = false }
}
function addressSaved(address) { addresses.value.push(address); addressId.value = address.id }
onMounted(load)
</script>
<template>
  <section class="checkout">
    <h1>Finalizar encomenda</h1>
    <p v-if="!cart.lines.length">Carrinho vazio. <RouterLink to="/cardapio">Voltar ao cardápio</RouterLink></p>
    <template v-else>
      <p class="muted">A disponibilidade depende dos horários cadastrados pela loja. Nenhuma cobrança automática será realizada.</p>
      <div v-if="!hours.length" class="error" role="alert">A loja ainda não configurou horários de atendimento. Não é possível finalizar pedidos.</div>
      <form class="card" @submit.prevent="review">
        <h2>Recebimento</h2>
        <label><input v-model="fulfillment" type="radio" value="pickup" /> Retirada</label>
        <label><input v-model="fulfillment" type="radio" value="delivery" /> Entrega (se habilitada)</label>
        <template v-if="fulfillment === 'delivery'">
          <label class="field">Endereço
            <select v-model="addressId" required>
              <option value="">Selecione um endereço</option>
              <option v-for="address in addresses" :key="address.id" :value="address.id">
                {{ address.street }}, {{ address.number }} — {{ address.zip_code }}
              </option>
            </select>
          </label>

        </template>
        <label class="field">Data e horário desejados
          <input v-model="scheduledAt" type="datetime-local" required />
        </label>
        <label class="field">Observações<textarea v-model.trim="notes" maxlength="1000" rows="3" /></label>
        <button class="button" :disabled="busy || !canQuote || !hours.length">Revisar preço e disponibilidade</button>
      </form>
      <AddressForm v-if="fulfillment === 'delivery'" @saved="addressSaved" />
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <OrderReview v-if="quote" :quote="quote" />
      <button v-if="quote" class="button" :disabled="busy" @click="confirm">{{ busy ? 'Confirmando...' : 'Confirmar pedido' }}</button>
    </template>
  </section>
</template>
<style scoped>
.checkout { display: grid; gap: 1.2rem; padding: 2rem 0; max-width: 800px; }
.checkout form { display: grid; gap: 1rem; }
.checkout label { margin-right: 1rem; }
.checkout select, .checkout input[type=datetime-local], textarea { padding: .7rem; max-width: 100%; }
</style>
