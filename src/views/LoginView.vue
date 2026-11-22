<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import PasswordField from "../components/layout/PasswordField.vue";
const login = ref("");
const password = ref("");
const error = ref("");
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
async function submit() {
  error.value = "";
  try {
    await auth.login(login.value, password.value);
    const redirect = route.query.redirect;
    const safe =
      typeof redirect === "string" &&
      redirect.startsWith("/") &&
      !redirect.startsWith("//");
    await router.replace(safe ? redirect : "/");
  } catch {
    error.value =
      "Não foi possível entrar. Confira seus dados e tente novamente.";
  }
}
</script>
<template>
  <section class="form-shell card">
    <p class="section-eyebrow">Bem-vindo de volta ♡</p>
    <h1>Entrar</h1>
    <p>Entre com seu e-mail ou usuário e continue sua encomenda.</p>
    <form @submit.prevent="submit">
      <label class="field"
        >E-mail ou usuário<input
          v-model.trim="login"
          autocomplete="username"
          required
      /></label>
      <PasswordField
        v-model="password"
        label="Senha"
        autocomplete="current-password"
      />
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button class="button" type="submit" :disabled="auth.loading">
        {{ auth.loading ? "Entrando..." : "Entrar" }}
      </button>
    </form>
    <p>
      Ainda não tem conta? <RouterLink to="/cadastro">Cadastre-se</RouterLink>.
    </p>
    <p class="muted">
      Recuperação de senha ainda não disponível nesta entrega.
    </p>
  </section>
</template>
