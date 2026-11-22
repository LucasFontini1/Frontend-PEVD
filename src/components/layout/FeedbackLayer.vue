<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const messages = ref([]);
const busy = ref(false);
let count = 0;
let sequence = 0;
function receive(event) {
  const item = { ...event.detail, id: ++sequence };
  messages.value.push(item);
  setTimeout(() => dismiss(item.id), 5500);
}
function dismiss(id) {
  messages.value = messages.value.filter((item) => item.id !== id);
}
function overlay(event) {
  count = Math.max(0, count + (event.detail.visible ? 1 : -1));
  busy.value = count > 0;
}
function act(item) {
  if (item.action?.to) router.push(item.action.to);
  dismiss(item.id);
}
onMounted(() => {
  window.addEventListener("pevd:toast", receive);
  window.addEventListener("pevd:overlay", overlay);
});
onUnmounted(() => {
  window.removeEventListener("pevd:toast", receive);
  window.removeEventListener("pevd:overlay", overlay);
});
</script>
<template>
  <div v-if="busy" class="overlay" role="status" aria-live="polite">
    <div class="loader">
      <span class="spinner" aria-hidden="true"></span>Processando...
    </div>
  </div>
  <div class="notifications" aria-live="polite">
    <div
      v-for="item in messages"
      :key="item.id"
      class="toast"
      :class="item.type"
      role="status"
    >
      <span>{{ item.message }}</span>
      <button v-if="item.action" class="toast-action" @click="act(item)">
        {{ item.action.label }}
      </button>
      <button
        class="close"
        aria-label="Fechar mensagem"
        @click="dismiss(item.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>
<style scoped>
.notifications {
  position: fixed;
  z-index: 150;
  top: 1rem;
  right: 1rem;
  width: min(400px, calc(100vw - 2rem));
  display: grid;
  gap: 0.6rem;
}
.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  background: white;
  border: 1px solid #dca4b5;
  border-left: 5px solid #c96680;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 12px 35px #40233130;
}
.toast.error {
  color: #842a37;
  border-left-color: #b32e42;
}
.toast-action {
  background: #c96680;
  color: white;
  border: 0;
  padding: 0.45rem 0.7rem;
  border-radius: 7px;
}
.close {
  margin-left: auto;
  background: transparent;
  border: 0;
  font-size: 1.4rem;
}
.overlay {
  position: fixed;
  inset: 0;
  z-index: 140;
  display: grid;
  place-items: center;
  background: #2715227a;
}
.loader {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  color: #704438;
  padding: 1.4rem 2rem;
  border-radius: 15px;
  font-weight: 800;
}
.spinner {
  width: 25px;
  height: 25px;
  border: 3px solid #f7d9e1;
  border-top-color: #c96680;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
