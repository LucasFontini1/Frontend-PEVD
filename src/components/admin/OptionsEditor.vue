<script setup>
import { onMounted, ref, watch } from "vue";
import { adminCatalogApi } from "../../api/adminCatalogApi";
import { apiMessage } from "../../utils/catalog";

const props = defineProps({ productId: { type: Number, required: true } });
const groups = ref([]);
const options = ref([]);
const groupName = ref("");
const optionName = ref("");
const optionPrice = ref("0.00");
const selectedGroup = ref("");
const required = ref(false);
const multiple = ref(false);
const error = ref("");
const editingOption = ref(null);
const editingGroup = ref(null);
const editName = ref("");
const editPrice = ref("0.00");
const editRequired = ref(false);
const editMultiple = ref(false);
async function reload() {
  try {
    const [g, o] = await Promise.all([
      adminCatalogApi.list("option-groups", { page_size: 100 }),
      adminCatalogApi.list("options", { page_size: 100 }),
    ]);
    groups.value = (g.data.results || g.data).filter(
      (item) => item.product === props.productId,
    );
    options.value = (o.data.results || o.data).filter((item) =>
      groups.value.some((group) => group.id === item.group),
    );
    if (!groups.value.some((x) => x.id === selectedGroup.value))
      selectedGroup.value = groups.value[0]?.id || "";
  } catch (err) {
    error.value = apiMessage(err);
  }
}
onMounted(reload);
watch(() => props.productId, reload);
async function addGroup() {
  error.value = "";
  try {
    await adminCatalogApi.create("option-groups", {
      product: props.productId,
      name: groupName.value,
      required: required.value,
      multiple: multiple.value,
    });
    groupName.value = "";
    await reload();
  } catch (err) {
    error.value = apiMessage(err);
  }
}
async function addOption() {
  error.value = "";
  try {
    await adminCatalogApi.create("options", {
      group: selectedGroup.value,
      name: optionName.value,
      additional_price: optionPrice.value,
    });
    optionName.value = "";
    optionPrice.value = "0.00";
    await reload();
  } catch (err) {
    error.value = apiMessage(err);
  }
}
function startEditGroup(group) {
  editingGroup.value = group.id;
  editingOption.value = null;
  editName.value = group.name;
  editRequired.value = group.required;
  editMultiple.value = group.multiple;
}
function startEditOption(option) {
  editingOption.value = option.id;
  editingGroup.value = null;
  editName.value = option.name;
  editPrice.value = option.additional_price;
}
async function saveGroup(id) {
  error.value = "";
  try {
    await adminCatalogApi.update("option-groups", id, {
      name: editName.value,
      required: editRequired.value,
      multiple: editMultiple.value,
    });
    editingGroup.value = null;
    await reload();
  } catch (err) {
    error.value = apiMessage(err);
  }
}
async function saveOption(id) {
  error.value = "";
  try {
    await adminCatalogApi.update("options", id, {
      name: editName.value,
      additional_price: editPrice.value,
    });
    editingOption.value = null;
    await reload();
  } catch (err) {
    error.value = apiMessage(err);
  }
}
async function remove(type, id) {
  if (!confirm("Remover esta opção do produto?")) return;
  try {
    await adminCatalogApi.disable(type, id);
    await reload();
  } catch (err) {
    error.value = apiMessage(err);
  }
}
</script>
<template>
  <section class="card">
    <h3>Personalizações</h3>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div v-for="group in groups" :key="group.id">
      <h4>
        {{ group.name }}
        <small>({{ group.required ? "obrigatório" : "opcional" }})</small>
      </h4>
      <button type="button" @click="startEditGroup(group)">Editar grupo</button>
      <button type="button" @click="remove('option-groups', group.id)">
        Excluir grupo
      </button>
      <form
        v-if="editingGroup === group.id"
        @submit.prevent="saveGroup(group.id)"
      >
        <label class="field"
          >Nome do grupo<input v-model.trim="editName" required
        /></label>
        <label
          ><input v-model="editRequired" type="checkbox" /> Obrigatório</label
        >
        <label
          ><input v-model="editMultiple" type="checkbox" /> Múltiplas
          opções</label
        >
        <p><button class="button">Salvar grupo</button></p>
      </form>
      <div
        v-for="option in options.filter((item) => item.group === group.id)"
        :key="option.id"
      >
        <p>{{ option.name }} (+ R$ {{ option.additional_price }})</p>
        <button type="button" @click="startEditOption(option)">Editar</button>
        <button type="button" @click="remove('options', option.id)">
          Excluir
        </button>
        <form
          v-if="editingOption === option.id"
          @submit.prevent="saveOption(option.id)"
        >
          <label class="field"
            >Nome<input v-model.trim="editName" required
          /></label>
          <label class="field"
            >Preço adicional<input
              v-model="editPrice"
              type="number"
              step=".01"
              min="0"
              required
          /></label>
          <button class="button">Salvar opção</button>
        </form>
      </div>
    </div>
    <form @submit.prevent="addGroup">
      <h4>Novo grupo</h4>
      <label class="field"
        >Nome<input v-model.trim="groupName" required
      /></label>
      <label><input v-model="required" type="checkbox" /> Obrigatório</label>
      <label
        ><input v-model="multiple" type="checkbox" /> Permitir múltiplas
        opções</label
      >
      <p><button class="button">Adicionar grupo</button></p>
    </form>
    <form v-if="groups.length" @submit.prevent="addOption">
      <h4>Nova opção</h4>
      <label class="field"
        >Grupo<select v-model="selectedGroup">
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select></label
      >
      <label class="field"
        >Nome<input v-model.trim="optionName" required
      /></label>
      <label class="field"
        >Preço adicional<input
          v-model="optionPrice"
          type="number"
          step=".01"
          min="0"
          required
      /></label>
      <p><button class="button">Adicionar opção</button></p>
    </form>
  </section>
</template>
<style scoped>
form {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  margin-top: 1.4rem;
}
select {
  padding: 0.7rem;
}
</style>
