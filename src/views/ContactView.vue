<script setup>
import { reactive, ref } from 'vue'
import { supportApi } from '../api/supportApi'
import { apiMessage } from '../utils/catalog'

const form = reactive({ name: '', email: '', subject: '', message: '', consent: false, website: '' })
const busy = ref(false)
const error = ref('')
const sent = ref(false)
async function send() {
  busy.value = true; error.value = ''
  try {
    await supportApi.contact({ ...form })
    sent.value = true
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
</script>
<template>
  <section class="contact">
    <h1>Entre em contato</h1>
    <p>Envie sua dúvida. Responderemos conforme nossa disponibilidade, sem prazo prometido.</p>
    <div v-if="sent" class="card" role="status">
      <h2>Mensagem recebida</h2>
      <p>Seu formulário foi enviado. Para acompanhar uma conversa, abra uma dúvida após entrar na sua conta.</p>
      <RouterLink to="/atendimento">Voltar ao atendimento</RouterLink>
    </div>
    <form v-else class="card" @submit.prevent="send">
      <label class="field">Seu nome<input v-model.trim="form.name" required minlength="2" maxlength="120" autocomplete="name" /></label>
      <label class="field">E-mail<input v-model.trim="form.email" type="email" required autocomplete="email" /></label>
      <label class="field">Assunto<input v-model.trim="form.subject" required minlength="4" maxlength="180" /></label>
      <label class="field">Mensagem<textarea v-model.trim="form.message" required minlength="12" maxlength="3000" rows="5" /></label>
      <div class="honeypot" aria-hidden="true">
        <label>Seu site<input v-model.trim="form.website" tabindex="-1" autocomplete="off" /></label>
      </div>
      <label><input v-model="form.consent" type="checkbox" required /> Autorizo o uso dos dados para responder este contato.</label>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <button class="button" :disabled="busy">{{ busy ? 'Enviando...' : 'Enviar mensagem' }}</button>
    </form>
  </section>
</template>
<style scoped>
.contact { max-width: 650px; margin: 2.5rem auto; }
.contact form { display: grid; gap: .8rem; }
.contact textarea { border: 1px solid var(--color-border); border-radius: 8px; padding: .8rem; }
.honeypot { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
</style>
