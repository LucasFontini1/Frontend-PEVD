<script setup>
import { ref, watch } from 'vue'
import { toast } from '../../utils/feedback'
import { useCartStore } from '../../stores/cartStore'

const props = defineProps({ product: { type: Object, required: true } })
const selected = ref({})
const quantity = ref(props.product.minimum_quantity)
watch(() => props.product, value => {
  selected.value = Object.fromEntries(value.option_groups.map(group => [group.id, []]))
  quantity.value = value.minimum_quantity
}, { immediate: true })
const error = ref('')
const cart = useCartStore()

function add() {
  error.value = ''
  const choices = []
  for (const group of props.product.option_groups) {
    const ids = selected.value[group.id] || []
    if (group.required && !ids.length) {
      error.value = `Escolha uma opção de ${group.name}.`
      toast(error.value, 'error')
      return
    }
    choices.push(...ids)
  }
  try {
    cart.add(props.product.id, quantity.value, choices)
    toast('Produto adicionado ao carrinho!', 'success', { label: 'Ir ao carrinho', to: '/carrinho' })
  } catch (err) { error.value = err.message; toast(error.value, 'error') }
}
function selectSingle(group, value) {
  selected.value[group.id] = value ? [Number(value)] : []
}
</script>
<template>
  <form class="card cart-form" @submit.prevent="add">
    <h2>Personalize sua encomenda</h2>
    <fieldset v-for="group in product.option_groups" :key="group.id">
      <legend>{{ group.name }} {{ group.required ? '(obrigatório)' : '(opcional)' }}</legend>
      <template v-if="group.multiple">
        <label v-for="option in group.options" :key="option.id">
          <input type="checkbox" :value="option.id" v-model="selected[group.id]" />
          {{ option.name }}
        </label>
      </template>
      <template v-else>
        <select :value="selected[group.id]?.[0] || ''" @change="selectSingle(group, $event.target.value)">
          <option value="">Selecione</option>
          <option v-for="option in group.options" :key="option.id" :value="option.id">{{ option.name }}</option>
        </select>
      </template>
    </fieldset>
    <label class="field">Quantidade
      <input v-model.number="quantity" type="number" :min="product.minimum_quantity" max="100" required />
    </label>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <button class="button" type="submit" :disabled="!product.is_available">Adicionar ao carrinho</button>
    <p class="muted">O preço e a disponibilidade serão confirmados no checkout.</p>
  </form>
</template>
<style scoped>
.cart-form { margin-top: 2rem; }
fieldset { border: 0; padding: 1rem 0; display: grid; gap: .7rem; }
fieldset label { display: flex; gap: .5rem; }
select, input[type=number] { padding: .65rem; border: 1px solid #aa998d; border-radius: 8px; }
</style>
