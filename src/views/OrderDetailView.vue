<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { orderApi } from "../api/orderApi";
import { apiMessage, currency } from "../utils/catalog";

const route = useRoute();
const order = ref(null);
const error = ref("");
const loading = ref(false);
const cancelling = ref(false);
async function load() {
  loading.value = true;
  error.value = "";
  try {
    order.value = (await orderApi.detail(route.params.codigo)).data;
  } catch (err) {
    order.value = null;
    error.value = apiMessage(err);
  } finally {
    loading.value = false;
  }
}
async function cancel() {
  if (!order.value || order.value.status !== "aguardando_confirmacao") return;
  if (!confirm("Deseja cancelar este pedido antes da confirmação?")) return;
  cancelling.value = true;
  error.value = "";
  try {
    await orderApi.cancel(order.value.public_id);
    await load();
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    cancelling.value = false;
  }
}
onMounted(load);
watch(() => route.params.codigo, load);
</script>
<template>
  <section class="order-detail">
    <h1>
      {{
        route.name === "orderSuccess"
          ? "Pedido registrado!"
          : "Detalhes do pedido"
      }}
    </h1>
    <p v-if="loading" role="status">Carregando pedido...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <template v-if="order">
      <p>
        Pedido: <strong>{{ order.public_id }}</strong>
      </p>
      <p v-if="order.customer_name">Cliente: <strong>{{ order.customer_name }}</strong></p>
      <p>
        Status: <strong>{{ order.status.replaceAll("_", " ") }}</strong>
      </p>
      <p>
        Pagamento: <strong>{{ order.payment_status }}</strong> (a combinar, sem
        cobrança automática)
      </p>
      <p>
        Recebimento:
        {{ order.fulfillment_type === "pickup" ? "Retirada" : "Entrega" }}
      </p>
      <p>Data: {{ new Date(order.scheduled_at).toLocaleString("pt-BR") }}</p>
      <div class="card">
        <h2>Itens e preços preservados</h2>
        <div v-for="(item, i) in order.items" :key="i">
          <p>
            {{ item.quantity }} × {{ item.product_name_snapshot }} —
            {{ currency(item.subtotal) }}
          </p>
          <p v-for="(option, j) in item.options" :key="j" class="muted">
            {{ option.group_name_snapshot }}:
            {{ option.option_name_snapshot }} (+
            {{ currency(option.additional_price_snapshot) }})
          </p>
        </div>
        <p>Frete: {{ currency(order.shipping) }}</p>
        <strong>Total: {{ currency(order.total) }}</strong>
      </div>
      <section class="card">
        <h2>Histórico</h2>
        <p v-for="(entry, i) in order.history" :key="i">
          {{ new Date(entry.changed_at).toLocaleString("pt-BR") }} —
          {{ entry.new_status.replaceAll("_", " ") }}
          <span v-if="entry.reason" class="backend-text">: {{ entry.reason }}</span>
        </p>
      </section>
      <button
        v-if="order.status === 'aguardando_confirmacao'"
        :disabled="cancelling"
        @click="cancel"
      >
        Cancelar pedido ainda não confirmado
      </button>
      <RouterLink to="/meus-pedidos">Voltar aos meus pedidos</RouterLink>
    </template>
  </section>
</template>
<style scoped>
.order-detail {
  display: grid;
  gap: 1.2rem;
  padding: 2rem 0;
  max-width: 800px;
}
</style>
