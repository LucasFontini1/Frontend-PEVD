<script setup>
import { onMounted, reactive, ref } from "vue";
import { orderApi } from "../../api/orderApi";
import { apiMessage, currency } from "../../utils/catalog";

const filters = reactive({ start: "", end: "" });
const report = ref(null);
const error = ref("");
const busy = ref(false);
async function load() {
  busy.value = true;
  error.value = "";
  try {
    const { data } = await orderApi.adminCompletedReport({
      ...(filters.start ? { start: filters.start } : {}),
      ...(filters.end ? { end: filters.end } : {}),
    });
    report.value = data;
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    busy.value = false;
  }
}
async function download() {
  busy.value = true;
  error.value = "";
  try {
    const response = await orderApi.adminCompletedCsv({
      ...(filters.start ? { start: filters.start } : {}),
      ...(filters.end ? { end: filters.end } : {}),
    });
    const file = new Blob([response.data], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pedidos-concluidos.csv";
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    busy.value = false;
  }
}
onMounted(load);
</script>
<template>
  <section class="report">
    <h2>Relatório de pedidos concluídos</h2>
    <p class="muted">
      Os filtros usam a data de conclusão dos pedidos, registrada no histórico.
      Pagamentos registrados no sistema não substituem conciliação bancária.
    </p>
    <form class="filters card" @submit.prevent="load">
      <label class="field"
        >De<input v-model="filters.start" type="date"
      /></label>
      <label class="field"
        >Até<input v-model="filters.end" type="date"
      /></label>
      <button class="button" :disabled="busy">Filtrar</button>
      <button type="button" :disabled="busy" @click="download">
        Exportar CSV
      </button>
    </form>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="busy" role="status">Carregando relatório...</p>
    <template v-if="report">
      <div class="metrics">
        <article class="card">
          <span>Pedidos concluídos</span
          ><strong>{{ report.orders_count }}</strong>
        </article>
        <article class="card">
          <span>Com pagamento registrado</span
          ><strong>{{ currency(report.paid_total) }}</strong>
        </article>
        <article class="card">
          <span>Pagamento pendente</span
          ><strong>{{ currency(report.unpaid_total) }}</strong>
        </article>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Origem</th>
              <th>Data</th>
              <th>Pagamento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in report.results" :key="item.public_id">
              <td>{{ item.public_id.slice(0, 8) }}</td>
              <td>{{ item.customer_display_name || item.customer_name || "Cliente não identificado" }}</td>
              <td>{{ item.source }}</td>
              <td>
                {{ new Date(item.completed_at).toLocaleDateString("pt-BR") }}
              </td>
              <td>{{ item.payment_status }}</td>
              <td>{{ currency(item.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="report.orders_count > report.results.length" class="muted">
        A tabela mostra os primeiros 500 pedidos do período; o resumo e o CSV
        incluem todos.
      </p>
      <p v-if="!report.orders_count">Nenhum pedido concluído nesse período.</p>
    </template>
  </section>
</template>
<style scoped>
.report {
  display: grid;
  gap: 1rem;
}
.filters {
  display: flex;
  align-items: end;
  gap: 0.8rem;
  flex-wrap: wrap;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.metrics article {
  display: grid;
  gap: 0.5rem;
}
.metrics strong {
  font-size: 1.5rem;
  color: var(--color-primary-hover);
}
.table-wrap {
  overflow-x: auto;
  border-radius: 14px;
}
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 610px;
  background: white;
}
th,
td {
  text-align: left;
  padding: 0.85rem;
  border-bottom: 1px solid var(--color-border);
}
th {
  background: var(--color-soft);
}
</style>
