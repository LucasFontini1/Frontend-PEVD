<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { supportApi } from '../api/supportApi'
import { apiMessage } from '../utils/catalog'

const route = useRoute()
const auth = useAuthStore()
const ticket = ref(null)
const message = ref('')
const loading = ref(false)
const error = ref('')
const saving = ref(false)
async function load() {
  error.value = ''; loading.value = true
  try { ticket.value = (await supportApi.ticket(route.params.id)).data }
  catch (err) { ticket.value = null; error.value = apiMessage(err) }
  finally { loading.value = false }
}
async function send() {
  error.value = ''; saving.value = true
  try {
    ticket.value = (await supportApi.message(ticket.value.id, message.value)).data
    message.value = ''
  } catch (err) { error.value = apiMessage(err) }
  finally { saving.value = false }
}
onMounted(load)
watch(() => route.params.id, load)
</script>
<template>
  <section class="thread">
    <RouterLink to="/atendimento/duvidas">Voltar às dúvidas</RouterLink>
    <h1>{{ ticket?.subject || 'Atendimento' }}</h1>
    <p v-if="loading" role="status">Carregando conversa...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <template v-if="ticket">
      <p>Status: <strong>{{ ticket.status }}</strong></p>
      <div v-for="item in ticket.messages" :key="item.id" class="card message">
        <strong>{{ item.sender === auth.user?.id ? 'Você' : 'Atendimento' }}</strong>
        <p>{{ item.body }}</p>
        <small>{{ new Date(item.created_at).toLocaleString('pt-BR') }}</small>
      </div>
      <form v-if="ticket.status !== 'encerrado'" class="card" @submit.prevent="send">
        <label class="field">Escreva sua resposta
          <textarea v-model.trim="message" required maxlength="4000" rows="4" />
        </label>
        <button class="button" :disabled="saving || !message">{{ saving ? 'Enviando...' : 'Enviar resposta' }}</button>
      </form>
      <p v-else class="muted">Este atendimento foi encerrado. Abra outro para enviar uma nova dúvida.</p>
    </template>
  </section>
</template>
<style scoped>
.thread { display: grid; gap: 1rem; padding: 2rem 0; max-width: 780px; }
.message p { white-space: pre-line; }
textarea { padding: .75rem; border: 1px solid var(--color-border); border-radius: 8px; }
</style>
