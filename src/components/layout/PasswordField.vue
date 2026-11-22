<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  autocomplete: { type: String, default: 'current-password' },
  minlength: { type: Number, default: undefined },
  required: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])
const visible = ref(false)
</script>

<template>
  <label class="field">
    <span>{{ label }}</span>
    <span class="password-wrap">
      <input
        :value="modelValue"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        :minlength="minlength"
        :required="required"
        @input="emit('update:modelValue', $event.target.value)"
      />
      <button
        class="visibility-toggle"
        type="button"
        :aria-label="visible ? 'Ocultar ' + label.toLowerCase() : 'Mostrar ' + label.toLowerCase()"
        :aria-pressed="visible"
        @click="visible = !visible"
      >
        <i class="mdi" :class="visible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" aria-hidden="true"></i>
        <span>{{ visible ? 'Ocultar' : 'Mostrar' }}</span>
      </button>
    </span>
  </label>
</template>

<style scoped>
.password-wrap { display: block; position: relative; width: 100%; }
.password-wrap input { padding-right: 7.1rem !important; }
.visibility-toggle {
  position: absolute; right: .35rem; top: 50%; transform: translateY(-50%);
  min-width: 5.9rem; min-height: 36px; display: inline-flex; align-items: center;
  justify-content: center; gap: .3rem; padding: .35rem .45rem;
  border: none; border-radius: 8px; background: transparent;
  color: var(--color-primary-hover); font-size: .85rem; font-weight: 700;
}
.visibility-toggle:hover { background: var(--color-soft); }
.visibility-toggle i { font-size: 1.15rem; }
</style>
