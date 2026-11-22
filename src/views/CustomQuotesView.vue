<script setup>
import { onMounted, reactive, ref } from "vue";
import { supportApi } from "../api/supportApi";
import { apiMessage, currency } from "../utils/catalog";

const entries = ref([]);
const error = ref("");
const loading = ref(false);
const busy = ref(false);
const form = reactive({
  title: "",
  details: "",
  flavor: "",
  portions: 10,
  desired_date: "",
});
async function load() {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await supportApi.quotes();
    entries.value = data.results || data;
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    loading.value = false;
  }
}
async function create() {
  busy.value = true;
  error.value = "";
  try {
    await supportApi.newQuote({ ...form });
    Object.assign(form, {
      title: "",
      details: "",
      flavor: "",
      portions: 10,
      desired_date: "",
    });
    await load();
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    busy.value = false;
  }
}
async function decide(quote, accept) {
  if (
    !confirm(
      accept
        ? "Aceitar o preço e as condições propostas?"
        : "Recusar a proposta?",
    )
  )
    return;
  busy.value = true;
  error.value = "";
  try {
    if (accept) await supportApi.acceptQuote(quote.id);
    else await supportApi.declineQuote(quote.id);
    await load();
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    busy.value = false;
  }
}
onMounted(load);
</script>
<template>
  <section class="quotes">
    <h1>Encomendas personalizadas</h1>
    <p>
      Descreva sua ideia. A loja avaliará disponibilidade, prazo e preço antes
      de propor um orçamento.
    </p>
    <form class="card form" @submit.prevent="create">
      <label class="field"
        >Título<input
          v-model.trim="form.title"
          required
          minlength="4"
          maxlength="160"
      /></label>
      <label class="field"
        >Detalhes<textarea
          v-model.trim="form.details"
          required
          minlength="10"
          maxlength="4000"
          rows="4"
        />
      </label>
      <label class="field"
        >Sabor desejado<input
          v-model.trim="form.flavor"
          required
          maxlength="120"
      /></label>
      <label class="field"
        >Porções<input
          v-model.number="form.portions"
          type="number"
          min="1"
          max="1000"
          required
      /></label>
      <label class="field"
        >Data desejada<input v-model="form.desired_date" type="date" required
      /></label>
      <button class="button" :disabled="busy">
        {{ busy ? "Enviando..." : "Solicitar orçamento" }}
      </button>
    </form>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="loading" role="status">Carregando propostas...</p>
    <h2>Minhas solicitações</h2>
    <p v-if="!entries.length && !loading">Nenhum orçamento solicitado.</p>
    <article v-for="quote in entries" :key="quote.id" class="card">
      <h3>{{ quote.title }}</h3>
      <p class="backend-text">{{ quote.details }}</p>
      <p>
        Status: <strong>{{ quote.status }}</strong>
      </p>
      <template v-if="quote.proposed_price !== null">
        <p>
          Valor proposto: <strong>{{ currency(quote.proposed_price) }}</strong>
        </p>
        <p class="backend-text">{{ quote.proposed_details }}</p>
        <p v-if="quote.valid_until">
          Validade: {{ new Date(quote.valid_until).toLocaleString("pt-BR") }}
        </p>
      </template>
      <div v-if="quote.status === 'proposto'" class="actions">
        <button class="button" :disabled="busy" @click="decide(quote, true)">
          Aceitar proposta
        </button>
        <button :disabled="busy" @click="decide(quote, false)">Recusar</button>
      </div>
      <p v-if="quote.status === 'aceito'" class="muted">
        Aceite registrado. O orçamento não gera um pedido ou cobrança
        automaticamente.
      </p>
    </article>
  </section>
</template>
<style scoped>
.quotes {
  display: grid;
  gap: 1.2rem;
  padding: 2rem 0;
  max-width: 840px;
}
.form {
  display: grid;
  gap: 0.6rem;
}
textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
