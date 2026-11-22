<script setup>
import { onMounted, ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { catalogApi } from '../api/catalogApi'
import { useAuthStore } from '../stores/authStore'
import { currency, apiMessage } from '../utils/catalog'
import { toast } from '../utils/feedback'

const cart = useCartStore()
const auth = useAuthStore()
const details = ref({})
const error = ref('')
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try {
    const { data } = await catalogApi.products({ page_size: 100 })
    for (const product of data.results || []) {
      if (cart.lines.some(line => line.product_id === product.id)) details.value[product.id] = product
    }
  } catch (err) { error.value = apiMessage(err) }
  finally { loading.value = false }
})
</script>
<template>
  <section class="cart-page">
    <span class="section-eyebrow">Falta pouco para seu doce momento</span>
    <h1>Meu carrinho ♡</h1>
    <p class="muted">O preço final e a disponibilidade serão recalculados antes do pedido.</p>
    <div v-if="loading" class="skeleton-list" role="status" aria-label="Carregando itens"><div v-for="i in 2" :key="i" class="skeleton"></div></div>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="!cart.lines.length">Seu carrinho está vazio. <RouterLink to="/cardapio">Ver cardápio</RouterLink></p>
    <div v-for="(line, index) in cart.lines" :key="index" class="card cart-line">
      <div>
        <h2>{{ details[line.product_id]?.name || `Produto #${line.product_id}` }}</h2>
        <p v-if="details[line.product_id]">{{ currency(details[line.product_id].effective_price) }} base — valor sujeito à confirmação</p>
        <p v-if="line.observation"><strong>Observações:</strong> {{ line.observation }}</p>
        <p v-if="line.selected_option_ids.length">Opções escolhidas: {{ line.selected_option_ids.join(', ') }}</p>
      </div>
      <label>Quantidade
        <input type="number" min="1" max="100" :value="line.quantity"
          @change="cart.update(index, Number($event.target.value))" />
      </label>
      <button @click="cart.remove(index); toast('Produto removido do carrinho.')">Remover</button>
    </div>
    <RouterLink v-if="cart.lines.length" class="button" :to="auth.isAuthenticated ? '/checkout' : '/entrar?redirect=/checkout'">Finalizar pedido</RouterLink>
  </section>
</template>
<style scoped>
.skeleton-list { display: grid; gap: 1rem; margin-bottom: 1rem; }
.skeleton { height: 150px; border-radius: 18px; background: linear-gradient(90deg,#f6e4e8 25%,#fff 50%,#f6e4e8 75%); background-size: 200% 100%; animation: loading 1.2s infinite; }
@keyframes loading { to { background-position: -200% 0; } }
.cart-page { padding: 2.5rem 0; max-width: 900px; }
.cart-page h1 { margin: .5rem 0 1rem; font-size: clamp(2.2rem,5vw,3.4rem); }
.cart-line { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 1rem; margin-bottom: 1rem; }
.cart-line h2 { font-size: 1.15rem; }
.cart-line label { display: grid; gap: .3rem; font-weight: 700; }
.cart-line input { width: 82px; padding: .6rem; }
.cart-line button { border: 1px solid #eac8d6; padding: .6rem .9rem;
  border-radius: 10px; color: #a52d53; background: var(--color-soft); }
</style>
