<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
const router = useRouter()
const auth = useAuthStore()
const values = reactive({ name: '', email: '', username: '', password: '', confirm: '', accepted_terms: false })
const loading = ref(false)
const error = ref('')
async function submit() {
  error.value = ''
  if (values.password !== values.confirm) { error.value = 'As senhas não coincidem.'; return }
  loading.value = true
  try {
    await auth.register({
      name: values.name, email: values.email, username: values.username,
      password: values.password, accepted_terms: values.accepted_terms,
    })
    await router.push({ name: 'login', query: { registered: '1' } })
  } catch (err) {
    const details = err.response?.data
    error.value = details ? Object.values(details).flat().join(' ') : 'Não foi possível realizar o cadastro.'
  } finally { loading.value = false }
}
</script>
<template>
  <section class="form-shell card">
    <h1>Criar conta</h1>
    <form @submit.prevent="submit">
      <label class="field">Nome<input v-model.trim="values.name" autocomplete="name" /></label>
      <label class="field">E-mail<input v-model.trim="values.email" type="email" autocomplete="email" required /></label>
      <label class="field">Nome de usuário<input v-model.trim="values.username" autocomplete="username" required /></label>
      <label class="field">Senha<input v-model="values.password" type="password" autocomplete="new-password" minlength="8" required /></label>
      <label class="field">Confirmar senha<input v-model="values.confirm" type="password" autocomplete="new-password" required /></label>
      <label><input v-model="values.accepted_terms" type="checkbox" required /> Aceito os termos de uso (texto pendente de revisão).</label>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <button class="button" type="submit" :disabled="loading">{{ loading ? 'Cadastrando...' : 'Cadastrar' }}</button>
    </form>
  </section>
</template>
