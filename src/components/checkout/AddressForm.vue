<script setup>
import { reactive, ref } from 'vue'
import { orderApi } from '../../api/orderApi'
import { apiMessage } from '../../utils/catalog'

const emit = defineEmits(['saved'])
const values = reactive({
  label: 'Principal', zip_code: '', street: '', number: '', complement: '',
  district: '', city: '', state: 'SC',
})
const busy = ref(false)
const error = ref('')
async function submit() {
  busy.value = true; error.value = ''
  try {
    const { data } = await orderApi.addAddress(values)
    emit('saved', data)
  } catch (err) { error.value = apiMessage(err) }
  finally { busy.value = false }
}
</script>
<template>
  <form class="card" @submit.prevent="submit">
    <h2>Adicionar endereço</h2>
    <div class="fields">
      <label class="field">Apelido<input v-model.trim="values.label" required /></label>
      <label class="field">CEP<input v-model.trim="values.zip_code" maxlength="9" required /></label>
      <label class="field">Rua<input v-model.trim="values.street" required /></label>
      <label class="field">Número<input v-model.trim="values.number" required /></label>
      <label class="field">Complemento<input v-model.trim="values.complement" /></label>
      <label class="field">Bairro<input v-model.trim="values.district" required /></label>
      <label class="field">Cidade<input v-model.trim="values.city" required /></label>
      <label class="field">UF<input v-model.trim="values.state" maxlength="2" required /></label>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <button class="button" :disabled="busy">{{ busy ? 'Salvando...' : 'Salvar endereço' }}</button>
  </form>
</template>
<style scoped>
.fields { display: grid; gap: .3rem 1rem; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
</style>
