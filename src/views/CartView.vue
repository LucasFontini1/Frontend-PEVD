<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { catalogApi } from '../api/catalogApi'
import { useAuthStore } from '../stores/authStore'
import { currency, apiMessage } from '../utils/catalog'

const cart = useCartStore()
const auth = useAuthStore()
const details = ref({})
const error = ref('')
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try {
    const products = await Promise.all(cart.lines.map(line =>
      catalogApi.products({ page_size: 100 }).then(({ data }) =>
        (data.results || []).find(item => item.id === line.product_id))))
    for (const product of products) if (product) details.value[product.id] = product
  } catch (err) { error.value = apiMessage(err) }
  finally { loading.value = false }
})
</script>
<template>
  <section class="cart-page">
    <h1>Meu carrinho</h1>
    <p class="muted">O preço final e a disponibilidade serão recalculados antes do pedido.</p>
    <p v-if="loading" role="status">Carregando itens...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="!cart.lines.length">Seu carrinho está vazio. <RouterLink to="/cardapio">Ver cardápio</RouterLink></p>
    <div v-for="(line, index) in cart.lines" :key="index" class="card cart-line">
      <div>
        <h2>{{ details[line.product_id]?.name || `Produto #${line.product_id}` }}</h2>
        <p v-if="details[line.product_id]">{{ currency(details[line.product_id].effective_price) }} base — valor sujeito à confirmação</p>
        <p v-if="line.selected_option_ids.length">Opções escolhidas: {{ line.selected_option_ids.join(', ') }}</p>
      </div>
      <label>Quantidade
        <input type="number" min="1" max="100" :value="line.quantity"
          @change="cart.update(index, Number($event.target.value))" />
      </label>
      <button @click="cart.remove(index)">Remover</button>
    </div>
    <RouterLink v-if="cart.lines.length" class="button" :to="auth.isAuthenticated ? '/checkout' : '/entrar?redirect=/checkout'">Finalizar pedido</RouterLink>
  </section>
</template>
<style scoped>
.cart-page { padding: 2rem 0; }
.cart-line { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.cart-line h2 { font-size: 1.15rem; }
.cart-line input { width: 72px; padding: .6rem; }
</style>
