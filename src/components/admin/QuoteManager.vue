<script setup>
import { onMounted, ref } from 'vue'
import { commercialApi } from '../../api/commercialApi'
import { apiMessage, currency } from '../../utils/catalog'
const entries = ref([])
const error = ref('')
const busy = ref(false)
const editing = ref(null)
const price = ref('')
const details = ref('')
const validUntil = ref('')
async function load() {
  error.value = ''
  try { const { data } = await commercialApi.quotes({ page_size: 100 }); entries.value = data.results || data }
  catch (err) { error.value = apiMessage(err) }
}
function edit(quote) {
  editing.value = quote.id
  price.value = quote.proposed_price || ''
  details.value = quote.proposed_details || ''
  validUntil.value = quote.valid_until?.slice(0, 16) || ''
}
async function submit(quote) {
  busy.value = true; error.value = ''
  try {
    await commercialApi.propose(quote.id, {
      proposed_price: price.value,
      proposed_details: details.value,
      valid_until: new Date(validUntil.value).toISOString(),
    })
    editing.value = null; await load()
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template>
  <section class="manager">
    <h2>Orçamentos personalizados</h2>
    <p>Informar valor e validade reais antes de apresentar proposta.</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="!entries.length">Nenhuma solicitação de orçamento.</p>
    <article v-for="quote in entries" :key="quote.id" class="card">
      <h3>{{ quote.title }}</h3>
      <p>{{ quote.details }}</p>
      <p>{{ quote.flavor }} · {{ quote.portions }} porções · {{ quote.desired_date }}</p>
      <p>Status: {{ quote.status }}</p>
      <p v-if="quote.proposed_price !== null">Preço proposto: {{ currency(quote.proposed_price) }}</p>
      <button v-if="['solicitado', 'proposto'].includes(quote.status)" @click="edit(quote)">Preparar proposta</button>
      <form v-if="editing === quote.id" @submit.prevent="submit(quote)">
        <label class="field">Preço total (R$)<input v-model="price" type="number" min="0" step=".01" required /></label>
        <label class="field">Detalhes e condições
          <textarea v-model.trim="details" required minlength="5" rows="3" />
        </label>
        <label class="field">Validade da proposta
          <input v-model="validUntil" type="datetime-local" required />
        </label>
        <button class="button" :disabled="busy">{{ busy ? 'Salvando...' : 'Enviar proposta' }}</button>
      </form>
    </article>
  </section>
</template>
<style scoped>
.manager, form { display: grid; gap: 1rem; }
textarea, input { padding: .7rem; border: 1px solid var(--color-border); border-radius: 8px; }
</style>
