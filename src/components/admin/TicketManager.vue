<script setup>
import { computed, onMounted, ref } from "vue";
import { commercialApi } from "../../api/commercialApi";
import { apiMessage } from "../../utils/catalog";

const tickets = ref([]);
const search = ref("");
const visible = computed(() =>
  tickets.value.filter((item) =>
    item.subject
      .toLocaleLowerCase("pt-BR")
      .includes(search.value.toLocaleLowerCase("pt-BR")),
  ),
);
const selected = ref(null);
const reply = ref("");
const closeAfter = ref(false);
const statusFilter = ref("");
const error = ref("");
const busy = ref(false);
const loadingThread = ref(false);

async function load() {
  error.value = "";
  try {
    const { data } = await commercialApi.tickets({
      page_size: 100,
      ...(statusFilter.value ? { status: statusFilter.value } : {}),
    });
    tickets.value = data.results || data;
    // Não substitua o detalhe aberto por dados parciais da listagem.
    if (
      selected.value &&
      !tickets.value.some((t) => t.id === selected.value.id)
    )
      selected.value = null;
  } catch (err) {
    error.value = apiMessage(err);
  }
}
async function openConversation(ticket) {
  if (selected.value?.id === ticket.id) {
    selected.value = null;
    return;
  }
  error.value = "";
  loadingThread.value = true;
  selected.value = null;
  try {
    selected.value = (await commercialApi.ticketDetail(ticket.id)).data;
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    loadingThread.value = false;
  }
}
async function send() {
  if (!selected.value || !reply.value.trim()) return;
  busy.value = true;
  error.value = "";
  try {
    const ticketId = selected.value.id;
    await commercialApi.reply(ticketId, reply.value, closeAfter.value);
    reply.value = "";
    closeAfter.value = false;
    selected.value = (await commercialApi.ticketDetail(ticketId)).data;
    await load();
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    busy.value = false;
  }
}
async function close() {
  if (!selected.value || !confirm("Encerrar este atendimento?")) return;
  busy.value = true;
  error.value = "";
  try {
    const ticketId = selected.value.id;
    await commercialApi.closeTicket(ticketId);
    selected.value = (await commercialApi.ticketDetail(ticketId)).data;
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
  <section class="manager">
    <div class="manager-intro">
      <h2>Atendimentos de clientes</h2>
      <p class="muted">
        Abra uma conversa para ler o histórico e responder sem sair da lista.
      </p>
    </div>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div class="filter-row card">
      <label class="field"
        >Situação
        <select v-model="statusFilter" @change="load">
          <option value="">Todos</option>
          <option value="aberto">Aberto</option>
          <option value="respondido">Respondido</option>
          <option value="encerrado">Encerrado</option>
        </select>
      </label>
      <label class="field"
        >Pesquisar pelo assunto
        <input
          v-model.trim="search"
          type="search"
          placeholder="Digite parte do assunto"
        />
      </label>
    </div>
    <p v-if="loadingThread" role="status">Abrindo conversa...</p>
    <p v-if="!visible.length" class="empty-state">
      Nenhum atendimento encontrado.
    </p>
    <article v-for="ticket in visible" :key="ticket.id" class="card ticket">
      <div class="summary">
        <div>
          <span class="status" :class="ticket.status">{{ ticket.status }}</span>
          <h3>{{ ticket.subject }}</h3>
          <p class="muted">
            Cliente #{{ ticket.user }} ·
            {{ new Date(ticket.updated_at).toLocaleDateString("pt-BR") }}
          </p>
        </div>
        <button
          type="button"
          class="button-outline"
          :aria-expanded="selected?.id === ticket.id"
          :disabled="loadingThread"
          @click="openConversation(ticket)"
        >
          {{
            selected?.id === ticket.id ? "Fechar conversa" : "Abrir conversa"
          }}
        </button>
      </div>
      <section
        v-if="selected?.id === ticket.id"
        class="conversation"
        :aria-label="'Conversa: ' + ticket.subject"
      >
        <h4>Histórico da conversa</h4>
        <div v-if="!selected.messages?.length" class="empty-state">
          Ainda não há mensagens.
        </div>
        <div
          v-for="message in selected.messages"
          :key="message.id"
          class="message"
          :class="{ 'admin-message': message.sender !== selected.user }"
        >
          <span class="message-author">{{
            message.sender === selected.user ? "Cliente" : "Equipe da loja"
          }}</span>
          <p class="backend-text">{{ message.body }}</p>
          <time :datetime="message.created_at">{{
            new Date(message.created_at).toLocaleString("pt-BR")
          }}</time>
        </div>
        <form
          v-if="selected.status !== 'encerrado'"
          @submit.prevent="send"
          class="reply-form"
        >
          <label class="field"
            >Responder cliente
            <textarea
              v-model.trim="reply"
              required
              maxlength="4000"
              rows="4"
              placeholder="Escreva sua resposta..."
            />
          </label>
          <label class="check"
            ><input v-model="closeAfter" type="checkbox" /> Encerrar após
            enviar</label
          >
          <div class="button-row">
            <button
              type="submit"
              class="button"
              :disabled="busy || !reply.trim()"
            >
              Enviar resposta
            </button>
            <button
              type="button"
              class="button-danger"
              :disabled="busy"
              @click="close"
            >
              Encerrar atendimento
            </button>
          </div>
        </form>
        <p v-else class="closed">
          Este atendimento está encerrado e fica disponível para consulta.
        </p>
      </section>
    </article>
  </section>
</template>
<style scoped>
.manager {
  display: grid;
  gap: 1rem;
}
.manager-intro h2 {
  margin-bottom: 0.4rem;
}
.filter-row {
  display: grid;
  grid-template-columns: minmax(180px, 0.7fr) minmax(230px, 1.3fr);
  gap: 1rem;
}
.ticket {
  display: grid;
  gap: 1rem;
}
.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.summary h3 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
.status {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  background: #fff0e3;
  color: #84552c;
}
.status.respondido {
  background: #e9f5ed;
  color: #276b47;
}
.status.encerrado {
  background: #f1eef2;
  color: #625865;
}
.conversation {
  border-top: 1px solid var(--color-border);
  display: grid;
  gap: 0.8rem;
  padding-top: 1.2rem;
}
.conversation h4 {
  margin: 0;
  color: var(--color-heading);
}
.message {
  max-width: 88%;
  background: #fff3f7;
  border: 1px solid var(--color-border);
  border-radius: 16px 16px 16px 4px;
  padding: 0.9rem 1.1rem;
}
.message.admin-message {
  justify-self: end;
  background: #f4f2fa;
  border-radius: 16px 16px 4px 16px;
}
.message-author {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-primary-hover);
}
.message p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 0.4rem 0;
}
.message time {
  color: var(--color-muted, #786c75);
  font-size: 0.73rem;
}
.reply-form {
  display: grid;
  gap: 0.8rem;
  margin-top: 0.5rem;
}
.check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.button-row {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}
.closed {
  color: #61556b;
  font-weight: 700;
}
@media (max-width: 650px) {
  .filter-row {
    grid-template-columns: 1fr;
  }
  .summary > button {
    width: 100%;
  }
  .message {
    max-width: 100%;
  }
}
</style>
