<script setup>
import { reactive, ref, watch } from "vue";
import { adminCatalogApi } from "../../api/adminCatalogApi";
import { apiMessage } from "../../utils/catalog";

const props = defineProps({
  selected: { type: Object, default: null },
  categories: { type: Array, required: true },
});
const emit = defineEmits(["saved", "cancel"]);
const form = reactive({
  name: "",
  slug: "",
  category: "",
  description: "",
  ingredients: "",
  allergen_info: "",
  conservation_info: "",
  price: "",
  promotional_price: "",
  unit: "unidade",
  minimum_quantity: 1,
  minimum_lead_hours: 0,
  is_active: true,
  is_available: true,
  is_featured: false,
  sort_order: 0,
});
const busy = ref(false);
const error = ref("");
watch(
  () => props.selected,
  (value) => {
    Object.assign(form, {
      name: value?.name || "",
      slug: value?.slug || "",
      category: value?.category || props.categories[0]?.id || "",
      description: value?.description || "",
      ingredients: value?.ingredients || "",
      allergen_info: value?.allergen_info || "",
      conservation_info: value?.conservation_info || "",
      price: value?.price ?? "",
      promotional_price: value?.promotional_price ?? "",
      unit: value?.unit || "unidade",
      minimum_quantity: value?.minimum_quantity || 1,
      minimum_lead_hours: value?.minimum_lead_hours || 0,
      is_active: value?.is_active ?? true,
      is_available: value?.is_available ?? true,
      is_featured: value?.is_featured ?? false,
      sort_order: value?.sort_order || 0,
    });
  },
  { immediate: true },
);
async function submit() {
  busy.value = true;
  error.value = "";
  try {
    const payload = {
      ...form,
      promotional_price: form.promotional_price || null,
    };
    if (props.selected)
      await adminCatalogApi.update("products", props.selected.id, payload);
    else await adminCatalogApi.create("products", payload);
    emit("saved");
  } catch (err) {
    error.value = apiMessage(err);
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <form class="card editor" @submit.prevent="submit">
    <h3>{{ selected ? "Editar produto" : "Novo produto" }}</h3>
    <div class="fields">
      <label class="field"
        >Nome<input v-model.trim="form.name" required maxlength="180"
      /></label>
      <label class="field"
        >Slug<input v-model.trim="form.slug" required pattern="[a-z0-9-]+"
      /></label>
      <label class="field"
        >Categoria
        <select v-model="form.category" required>
          <option disabled value="">Selecione</option>
          <option v-for="item in categories" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </label>
      <label class="field"
        >Unidade<input v-model.trim="form.unit" maxlength="80" required
      /></label>
      <label class="field"
        >Preço (R$)<input
          v-model="form.price"
          type="number"
          min="0"
          step="0.01"
          required
      /></label>
      <label class="field"
        >Preço promocional (opcional)<input
          v-model="form.promotional_price"
          type="number"
          min="0"
          step="0.01"
      /></label>
      <label class="field"
        >Quantidade mínima<input
          v-model.number="form.minimum_quantity"
          type="number"
          min="1"
          required
      /></label>
      <label class="field"
        >Antecedência (horas)<input
          v-model.number="form.minimum_lead_hours"
          type="number"
          min="0"
          required
      /></label>
      <label class="field"
        >Ordem<input v-model.number="form.sort_order" type="number" min="0"
      /></label>
    </div>
    <label class="field"
      >Descrição<textarea v-model.trim="form.description" rows="3" />
    </label>
    <label class="field"
      >Ingredientes<textarea v-model.trim="form.ingredients" rows="2" />
    </label>
    <label class="field"
      >Alergênicos<textarea v-model.trim="form.allergen_info" rows="2" />
    </label>
    <label class="field"
      >Conservação<textarea v-model.trim="form.conservation_info" rows="2" />
    </label>
    <div class="toggles">
      <label
        ><input v-model="form.is_active" type="checkbox" /> Publicado</label
      >
      <label
        ><input v-model="form.is_available" type="checkbox" /> Disponível</label
      >
      <label
        ><input v-model="form.is_featured" type="checkbox" /> Destaque</label
      >
    </div>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div class="actions">
      <button class="button" :disabled="busy">
        {{ busy ? "Salvando..." : "Salvar produto" }}
      </button>
      <button type="button" @click="emit('cancel')">Cancelar</button>
    </div>
  </form>
</template>
<style scoped>
.editor {
  max-width: 940px;
}
.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0 1rem;
}
.editor textarea,
.editor select {
  padding: 0.7rem;
  border: 1px solid #a48d80;
  border-radius: 8px;
  background: white;
}
.toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-block: 1rem;
}
.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
