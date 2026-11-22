<script setup>
import { onMounted, reactive, ref } from "vue";
import { commercialApi } from "../../api/commercialApi";
import { currency, apiMessage } from "../../utils/catalog";

const filters = reactive({ start: "", end: "" });
const data = ref(null);
const error = ref("");
const loading = ref(false);
const stats = [
  ["orders_count", "Pedidos registrados"],
  ["paid_orders_count", "Pedidos marcados como pagos"],
  ["contacts_count", "Contatos recebidos"],
  ["open_tickets_count", "Tickets abertos"],
  ["quotes_pending_count", "Orçamentos aguardando avaliação"],
];
async function load() {
  loading.value = true;
  error.value = "";
  try {
    const result = await commercialApi.dashboard({
      ...(filters.start ? { start: filters.start } : {}),
      ...(filters.end ? { end: filters.end } : {}),
    });
    data.value = result.data;
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <section class="dashboard">
    <h2>Indicadores reais</h2>
    <p class="muted">
      O faturamento corresponde apenas a pedidos marcados manualmente como pagos
      e não cancelados.
    </p>
    <form class="filters" @submit.prevent="load">
      <label>De <input v-model="filters.start" type="date" /></label>
      <label>Até <input v-model="filters.end" type="date" /></label>
      <button class="button" :disabled="loading">Filtrar</button>
    </form>
    <p v-if="loading" role="status">Calculando indicadores...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <template v-if="data">
      <div class="stats">
        <article v-for="[key, title] in stats" :key="key" class="card">
          <h3>{{ title }}</h3>
          <p class="value">{{ data[key] }}</p>
        </article>
        <article class="card">
          <h3>Total dos pedidos marcados como pagos</h3>
          <p class="value">{{ currency(data.recorded_paid_revenue) }}</p>
        </article>
      </div>
      <section class="card">
        <h3>Produtos mais pedidos (quantidades)</h3>
        <p v-if="!data.top_products.length">Sem itens no período.</p>
        <p v-for="item in data.top_products" :key="item.product_name_snapshot">
          {{ item.product_name_snapshot }}: {{ item.quantity }}
        </p>
      </section>
    </template>
  </section>
</template>
<style scoped>
.dashboard {
  display: grid;
  gap: 1rem;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}
.filters label {
  display: grid;
  gap: 0.4rem;
}
.filters input {
  border: 1px solid var(--color-border);
  padding: 0.6rem;
  border-radius: 8px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}
.stats h3 {
  font-size: 0.95rem;
}
.value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
}
</style>
