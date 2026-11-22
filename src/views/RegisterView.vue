<script setup>
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import PasswordField from "../components/layout/PasswordField.vue";
import { toast } from "../utils/feedback";
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const values = reactive({
  name: "",
  email: "",
  username: "",
  password: "",
  confirm: "",
  accepted_terms: false,
});
const loading = ref(false);
const error = ref("");
async function submit() {
  error.value = "";
  if (values.password !== values.confirm) {
    error.value = "As senhas não coincidem.";
    toast(error.value, "error");
    return;
  }
  loading.value = true;
  try {
    await auth.register({
      name: values.name,
      email: values.email,
      username: values.username,
      password: values.password,
      accepted_terms: values.accepted_terms,
    });
    try {
      await auth.login(values.email, values.password);
      toast("Cadastro realizado! Você já está conectado.");
      const redirect = route.query.redirect;
      const safe =
        typeof redirect === "string" &&
        redirect.startsWith("/") &&
        !redirect.startsWith("//");
      await router.replace(safe ? redirect : "/");
    } catch {
      toast(
        "Conta criada, mas o login automático não foi concluído. Entre com suas credenciais.",
        "error",
      );
      await router.replace({ name: "login", query: { registered: "1" } });
    }
  } catch (err) {
    const details = err.response?.data;
    error.value = details
      ? Object.values(details).flat().join(" ")
      : "Não foi possível realizar o cadastro.";
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <section class="form-shell card">
    <p class="section-eyebrow">Um doce começo ♡</p>
    <h1>Criar conta</h1>
    <form @submit.prevent="submit">
      <label class="field"
        >Nome<input v-model.trim="values.name" autocomplete="name"
      /></label>
      <label class="field"
        >E-mail<input
          v-model.trim="values.email"
          type="email"
          autocomplete="email"
          required
      /></label>
      <label class="field"
        >Nome de usuário<input
          v-model.trim="values.username"
          autocomplete="username"
          required
      /></label>
      <PasswordField
        v-model="values.password"
        label="Senha"
        autocomplete="new-password"
        :minlength="8"
      />
      <PasswordField
        v-model="values.confirm"
        label="Confirmar senha"
        autocomplete="new-password"
      />
      <label
        ><input v-model="values.accepted_terms" type="checkbox" required />
        Aceito os termos de uso (texto pendente de revisão).</label
      >
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <button class="button" type="submit" :disabled="loading">
        {{ loading ? "Cadastrando..." : "Cadastrar" }}
      </button>
    </form>
  </section>
</template>
