<script setup>
import { computed, onMounted, ref } from "vue";
import { supportApi } from "../../api/supportApi";
import { apiMessage } from "../../utils/catalog";

const query = ref("");
const faqs = ref([]);
const loading = ref(false);
const error = ref("");
const filtered = computed(() => {
  const text = query.value.toLocaleLowerCase("pt-BR").trim();
  return faqs.value.filter(
    (f) =>
      !text ||
      `${f.question} ${f.answer}`.toLocaleLowerCase("pt-BR").includes(text),
  );
});
onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await supportApi.faqs({ page_size: 100 });
    faqs.value = data.results || data;
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <section class="faq">
    <h2>Perguntas frequentes</h2>
    <label class="field"
      >Buscar resposta
      <input
        v-model.trim="query"
        type="search"
        placeholder="Digite sua dúvida"
      />
    </label>
    <p v-if="loading" role="status">Carregando perguntas...</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="!loading && !error && !filtered.length" class="muted">
      {{
        query
          ? "Nenhuma resposta encontrada."
          : "Perguntas ainda não publicadas."
      }}
    </p>
    <details v-for="faq in filtered" :key="faq.id" class="entry">
      <summary>{{ faq.question }}</summary>
      <p>{{ faq.answer }}</p>
    </details>
  </section>
</template>
<style scoped>
.faq {
  display: grid;
  gap: 0.8rem;
}
.entry {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.9rem 1.2rem;
}
.entry summary {
  cursor: pointer;
  font-weight: 700;
  color: var(--color-heading);
}
.entry p {
  white-space: pre-line;
}
.faq input {
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  border-radius: 9px;
  width: min(100%, 500px);
}
</style>
