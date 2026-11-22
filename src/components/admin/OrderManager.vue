<script setup>
import { computed, onMounted, ref } from "vue";
import { orderApi } from "../../api/orderApi";
import { apiMessage, currency } from "../../utils/catalog";
import ConfirmModal from "../layout/ConfirmModal.vue";
import { toast } from "../../utils/feedback";
const orders = ref([]);
const search = ref("");
const state = ref("");
const view = ref("list");
const filtered = computed(() =>
  orders.value.filter((order) => {
    const text =
      `${order.customer_display_name || order.customer_name || ""} ${order.customer_phone || ""} ${order.public_id || ""}`.toLocaleLowerCase(
        "pt-BR",
      );
    return (
      (!search.value ||
        text.includes(search.value.toLocaleLowerCase("pt-BR"))) &&
      (!state.value || order.status === state.value)
    );
  }),
);
const error = ref("");
const busy = ref(false);
const reason = ref("");
const pending = ref(null);
const selectedStatus = ref({});
import ManualOrderForm from "./ManualOrderForm.vue";
import CompletedOrdersReport from "./CompletedOrdersReport.vue";
const allowed = {
  aguardando_confirmacao: ["confirmado", "rejeitado", "cancelado"],
  confirmado: ["em_preparo", "cancelado"],
  em_preparo: ["pronto"],
  pronto: [
    "aguardando_confirmacao",
    "confirmado",
    "em_preparo",
    "concluido",
    "cancelado",
    "rejeitado",
  ],
};
const statuses = [
  ["aguardando_confirmacao", "Aguardando"],
  ["confirmado", "Confirmar"],
  ["rejeitado", "Rejeitar"],
  ["em_preparo", "Em preparo"],
  ["pronto", "Pronto"],
  ["concluido", "Concluir"],
  ["cancelado", "Cancelar"],
];
function availableTransitions(order) {
  return statuses.filter(([status]) =>
    (allowed[order.status] || []).includes(status),
  );
}
async function load() {
  error.value = "";
  try {
    const { data } = await orderApi.adminOrders({ page_size: 100 });
    orders.value = data.results || data;
  } catch (err) {
    error.value = apiMessage(err);
  }
}
async function transition(id, status) {
  pending.value = { id, status, kind: "status" };
}
async function commitAction() {
  if (!pending.value) return;
  const action = pending.value;
  busy.value = true;
  error.value = "";
  try {
    if (action.kind === "payment") await orderApi.adminPayment(action.id, "");
    else await orderApi.adminTransition(action.id, action.status, reason.value);
    pending.value = null;
    reason.value = "";
    toast(
      action.kind === "payment"
        ? "Pagamento confirmado."
        : "Status atualizado.",
    );
    await load();
  } catch (err) {
    error.value = apiMessage(err);
    toast(error.value, "error");
  } finally {
    busy.value = false;
  }
}
function markPaid(id) {
  pending.value = { id, kind: "payment" };
}
onMounted(load);
</script>
<template>
  <section class="manager">
    <h2>Gestão de pedidos</h2>
    <nav class="section-nav" aria-label="Funções de pedidos">
      <button :aria-pressed="view === 'list'" @click="view = 'list'">
        Pedidos
      </button>
      <button :aria-pressed="view === 'manual'" @click="view = 'manual'">
        Novo pedido WhatsApp
      </button>
      <button :aria-pressed="view === 'report'" @click="view = 'report'">
        Relatório de concluídos
      </button>
    </nav>
    <ManualOrderForm
      v-if="view === 'manual'"
      @created="
        load();
        view = 'list';
      "
    />
    <CompletedOrdersReport v-else-if="view === 'report'" />
    <template v-else>
      <div class="filters">
        <label class="field"
          >Pesquisar por cliente, telefone ou código
          <input
            v-model.trim="search"
            type="search"
            placeholder="Nome ou código do pedido"
          />
        </label>
        <label class="field"
          >Situação
          <select v-model="state">
            <option value="">Todas</option>
            <option value="aguardando_confirmacao">Aguardando</option>
            <option value="confirmado">Confirmado</option>
            <option value="em_preparo">Em preparo</option>
            <option value="pronto">Pronto</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
            <option value="rejeitado">Rejeitado</option>
          </select>
        </label>
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="!orders.length && !error && view === 'list'">
        Nenhum pedido registrado.
      </p>
      <label class="field"
        >Observação opcional sobre a mudança<input
          v-model.trim="reason"
          maxlength="200"
      /></label>
      <article v-for="order in filtered" :key="order.public_id" class="card">
        <h3>Pedido {{ order.public_id.slice(0, 8) }}</h3>
        <p>
          <strong>{{ order.customer_display_name || order.customer_name || "Cliente não identificado" }}</strong>
          <span v-if="order.customer_phone"> · {{ order.customer_phone }}</span>
          · Origem: {{ order.source === "whatsapp" ? "WhatsApp" : "Site" }}
        </p>
        <p>
          {{ order.status.replaceAll("_", " ") }} | Pagamento:
          {{ order.payment_status }}
        </p>
        <p>
          <strong>{{ currency(order.total) }}</strong> —
          {{ order.fulfillment_type }}
        </p>
        <p>{{ new Date(order.scheduled_at).toLocaleString("pt-BR") }}</p>
        <p v-if="order.notes" class="backend-text">
          <strong>Observações:</strong> {{ order.notes }}
        </p>
        <p v-for="(item, i) in order.items" :key="i">
          {{ item.quantity }} × {{ item.product_name_snapshot }}
        </p>
        <div class="buttons">
          <template v-if="order.status === 'pronto'">
            <label class="field"
              >Alterar situação do pedido
              <select v-model="selectedStatus[order.id]">
                <option value="">Selecione um status</option>
                <option
                  v-for="[status, label] in availableTransitions(order)"
                  :key="status"
                  :value="status"
                >
                  {{ label }}
                </option>
              </select>
            </label>
            <button
              type="button"
              class="button-outline"
              :disabled="busy || !selectedStatus[order.id]"
              @click="transition(order.id, selectedStatus[order.id])"
            >
              Alterar status
            </button>
          </template>
          <button
            v-else
            v-for="[status, label] in availableTransitions(order)"
            type="button"
            class="button-outline"
            :key="status"
            :disabled="busy"
            @click="transition(order.id, status)"
          >
            {{ label }}
          </button>
          <button
            type="button"
            class="button"
            v-if="
              order.payment_status === 'pendente' &&
              !['rejeitado', 'cancelado'].includes(order.status)
            "
            :disabled="busy"
            @click="markPaid(order.id)"
          >
            Confirmar pagamento manual
          </button>
        </div>
      </article>
      <p v-if="!filtered.length && orders.length">
        Nenhum pedido corresponde à busca.
      </p>
    </template>
    <ConfirmModal
      :open="!!pending"
      :busy="busy"
      :title="
        pending?.kind === 'payment'
          ? 'Confirmar pagamento manual?'
          : 'Alterar status do pedido?'
      "
      :description="
        pending?.kind === 'payment'
          ? 'Confirme somente se recebeu o pagamento fora do site.'
          : 'A alteração será registrada no histórico.'
      "
      @confirm="commitAction"
      @cancel="pending = null"
    />
  </section>
</template>
<style scoped>
.manager {
  display: grid;
  gap: 1rem;
}
.section-nav,
.filters {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.section-nav button {
  border: 1px solid var(--color-border);
  border-radius: 11px;
  padding: 0.7rem 1rem;
}
.section-nav button[aria-pressed="true"] {
  background: var(--color-primary);
  color: #fff;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.buttons button {
  padding: 0.5rem;
  cursor: pointer;
}
</style>
