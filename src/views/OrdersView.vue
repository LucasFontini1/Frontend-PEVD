<script setup>
import { onMounted, ref } from 'vue'
import { orderApi } from '../api/orderApi'
import { apiMessage, currency } from '../utils/catalog'
const orders = ref([])
const error = ref('')
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try {
    const { data } = await orderApi.orders()
    orders.value = data.results || data
  } catch (err) { error.value = apiMessage(err) }
  finally { loading.value = false }
})
</script>
<template>
  <section class="orders">
    <h1>Meus pedidos</h1>
    <p v-if="loading" role="status">Carregando pedidos...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="!loading && !error && !orders.length">Você ainda não realizou pedidos.</p>
    <div v-for="order in orders" :key="order.public_id" class="card">
      <h2>Pedido {{ order.public_id.slice(0, 8) }}</h2>
      <p>Status: <strong>{{ order.status.replaceAll('_', ' ') }}</strong></p>
      <p>Total registrado: <strong>{{ currency(order.total) }}</strong></p>
      <p>Pagamento: {{ order.payment_status }}</p>
      <RouterLink :to="`/meus-pedidos/${order.public_id}`">Ver pedido e histórico</RouterLink>
    </div>
  </section>
</template>
<style scoped>
.orders { display: grid; gap: 1.2rem; padding: 2rem 0; }
.orders h2 { font-size: 1.15rem; }
</style>
