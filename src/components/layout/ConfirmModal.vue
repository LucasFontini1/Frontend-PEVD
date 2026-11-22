<script setup>
defineProps({ open: Boolean, title: { type: String, default: 'Confirmar ação' },
  description: { type: String, default: 'Deseja continuar?' }, busy: Boolean })
const emit = defineEmits(['confirm', 'cancel'])
</script>
<template>
  <div v-if="open" class="backdrop" @click.self="emit('cancel')">
    <section class="dialog" role="dialog" aria-modal="true" :aria-label="title">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <div class="actions">
        <button type="button" class="button-outline" :disabled="busy" @click="emit('cancel')">Cancelar</button>
        <button type="button" class="button" :disabled="busy" @click="emit('confirm')">{{ busy ? 'Aguarde...' : 'Confirmar' }}</button>
      </div>
    </section>
  </div>
</template>
<style scoped>
.backdrop { position: fixed; inset: 0; background: #21141f9c; z-index: 100; display: grid; place-items: center; padding: 1rem; }
.dialog { width: min(440px, 100%); padding: 1.5rem; border-radius: 20px; background: white; box-shadow: 0 20px 60px #0003; }
.dialog h2 { font-size: 1.5rem; margin-top: 0; }
.actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: .75rem; }
</style>
