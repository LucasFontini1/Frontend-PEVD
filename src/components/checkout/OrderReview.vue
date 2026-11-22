<script setup>
import { currency } from "../../utils/catalog";
defineProps({ quote: { type: Object, required: true } });
</script>
<template>
  <section class="card">
    <h2>Resumo confirmado pelo servidor</h2>
    <div v-for="(item, index) in quote.items" :key="index" class="line">
      <span>{{ item.quantity }} × {{ item.name }}</span>
      <strong>{{ currency(item.subtotal) }}</strong>
    </div>
    <p>Subtotal: {{ currency(quote.subtotal) }}</p>
    <p>Taxa de entrega: {{ currency(quote.shipping) }}</p>
    <p class="total">Total: {{ currency(quote.total) }}</p>
    <p class="muted">
      Pagamento a combinar. O pedido ficará aguardando confirmação.
    </p>
  </section>
</template>
<style scoped>
.line {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding: 0.5rem 0;
}
.total {
  font-size: 1.35rem;
  font-weight: 800;
}
</style>
