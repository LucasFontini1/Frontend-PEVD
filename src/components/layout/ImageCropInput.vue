<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: File, default: null },
  label: { type: String, default: "Imagem" },
  aspectRatio: { type: Number, default: 1 },
});
const emit = defineEmits(["update:modelValue"]);
const fileInput = ref(null);
const cameraInput = ref(null);
const canvas = ref(null);
const dialog = ref(false);
const chooser = ref(false);
const mobile = ref(false);
const image = ref(null);
const filename = ref("");
const zoom = ref(1);
const offset = ref({ x: 0, y: 0 });
const pointer = ref(null);
const error = ref("");
const previewUrl = ref("");
const ratio = computed(() => Math.max(0.35, Math.min(4, props.aspectRatio)));
const viewportWidth = 360;
const viewportHeight = computed(() => Math.round(viewportWidth / ratio.value));
let sourceUrl = null;

function cleanupSource() {
  if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  sourceUrl = null;
}
function cleanupPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = "";
}
function choose() {
  const canTouch = typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0);
  mobile.value = canTouch;
  if (canTouch) chooser.value = true;
  else fileInput.value?.click();
}
function openFiles() {
  chooser.value = false;
  fileInput.value?.click();
}
function openCamera() {
  chooser.value = false;
  cameraInput.value?.click();
}
async function loadFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    error.value = "Escolha uma imagem PNG, JPG ou WebP.";
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    error.value = "A imagem deve ter no máximo 10 MB.";
    return;
  }
  error.value = "";
  cleanupSource();
  sourceUrl = URL.createObjectURL(file);
  const img = new Image();
  img.onload = async () => {
    image.value = img;
    filename.value = file.name;
    zoom.value = 1;
    offset.value = { x: 0, y: 0 };
    dialog.value = true;
    await nextTick();
    draw();
  };
  img.onerror = () => {
    error.value = "Não foi possível ler esta imagem.";
    cleanupSource();
  };
  img.src = sourceUrl;
}
function dimensions() {
  if (!image.value) return null;
  const img = image.value;
  const base = Math.max(viewportWidth / img.naturalWidth, viewportHeight.value / img.naturalHeight);
  const width = img.naturalWidth * base * zoom.value;
  const height = img.naturalHeight * base * zoom.value;
  return { width, height, limitX: Math.max(0, (width - viewportWidth) / 2), limitY: Math.max(0, (height - viewportHeight.value) / 2) };
}
function clampOffset() {
  const d = dimensions();
  if (!d) return;
  offset.value = {
    x: Math.max(-d.limitX, Math.min(d.limitX, offset.value.x)),
    y: Math.max(-d.limitY, Math.min(d.limitY, offset.value.y)),
  };
}
function draw() {
  if (!canvas.value || !image.value) return;
  clampOffset();
  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  const d = dimensions();
  ctx.clearRect(0, 0, viewportWidth, viewportHeight.value);
  ctx.drawImage(image.value, (viewportWidth - d.width) / 2 + offset.value.x,
    (viewportHeight.value - d.height) / 2 + offset.value.y, d.width, d.height);
}
function startDrag(event) {
  if (!image.value) return;
  pointer.value = { id: event.pointerId, x: event.clientX, y: event.clientY, offset: { ...offset.value } };
  canvas.value?.setPointerCapture(event.pointerId);
}
function moveDrag(event) {
  if (!pointer.value || event.pointerId !== pointer.value.id) return;
  const bounds = canvas.value.getBoundingClientRect();
  offset.value = {
    x: pointer.value.offset.x + (event.clientX - pointer.value.x) * viewportWidth / bounds.width,
    y: pointer.value.offset.y + (event.clientY - pointer.value.y) * viewportHeight.value / bounds.height,
  };
  draw();
}
function stopDrag(event) {
  if (pointer.value?.id === event.pointerId) pointer.value = null;
}
function reset() {
  zoom.value = 1;
  offset.value = { x: 0, y: 0 };
  draw();
}
function cancel() {
  dialog.value = false;
  image.value = null;
  pointer.value = null;
  cleanupSource();
}
async function confirm() {
  if (!image.value) return;
  const size = 1200;
  const width = Math.round(size * ratio.value);
  const height = size;
  const target = document.createElement("canvas");
  target.width = width;
  target.height = height;
  const ctx = target.getContext("2d");
  if (!ctx) return;
  const d = dimensions();
  clampOffset();
  const sx = width / viewportWidth;
  const sy = height / viewportHeight.value;
  ctx.drawImage(image.value, ((viewportWidth - d.width) / 2 + offset.value.x) * sx,
    ((viewportHeight.value - d.height) / 2 + offset.value.y) * sy,
    d.width * sx, d.height * sy);
  const blob = await new Promise(resolve => target.toBlob(resolve, "image/webp", 0.88));
  if (!blob) { error.value = "Não foi possível gerar a imagem recortada."; return; }
  const safeName = filename.value.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "imagem";
  const selected = new File([blob], `${safeName}-recortada.webp`, { type: "image/webp" });
  cleanupPreview();
  previewUrl.value = URL.createObjectURL(selected);
  emit("update:modelValue", selected);
  cancel();
}
function clear() {
  emit("update:modelValue", null);
  cleanupPreview();
}
watch(zoom, draw);
watch(() => props.modelValue, value => { if (!value) cleanupPreview(); });
onBeforeUnmount(() => { cleanupSource(); cleanupPreview(); });
</script>

<template>
  <div class="image-picker">
    <div class="picker-label">{{ label }}</div>
    <div class="picker-actions">
      <button type="button" class="button-outline" @click="choose">
        <i class="mdi mdi-image-edit-outline" aria-hidden="true"></i> {{ modelValue ? "Trocar e recortar" : "Selecionar imagem" }}
      </button>
      <button v-if="modelValue" type="button" class="button-outline" @click="clear">Remover seleção</button>
    </div>
    <input ref="fileInput" class="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" @change="loadFile" />
    <input ref="cameraInput" class="visually-hidden" type="file" accept="image/*" capture="environment" @change="loadFile" />
    <img v-if="previewUrl" class="selected-preview" :src="previewUrl" alt="Pré-visualização da imagem recortada" />
    <p v-if="modelValue" class="muted selection-name">{{ modelValue.name }}</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>

    <div v-if="chooser" class="picker-backdrop" @click.self="chooser = false">
      <div class="picker-sheet" role="dialog" aria-modal="true" aria-label="Escolher origem da imagem">
        <h3>Adicionar foto</h3>
        <button type="button" @click="openCamera"><i class="mdi mdi-camera-outline" aria-hidden="true"></i> Abrir câmera</button>
        <button type="button" @click="openFiles"><i class="mdi mdi-image-multiple-outline" aria-hidden="true"></i> Galeria ou arquivos</button>
        <button type="button" @click="chooser = false">Cancelar</button>
      </div>
    </div>

    <div v-if="dialog" class="picker-backdrop" @click.self="cancel">
      <section class="crop-dialog" role="dialog" aria-modal="true" aria-label="Ajustar imagem antes do envio">
        <header>
          <h3>Ajustar imagem</h3>
          <button type="button" aria-label="Fechar" @click="cancel"><i class="mdi mdi-close"></i></button>
        </header>
        <p class="muted">Arraste a foto para posicioná-la dentro do recorte.</p>
        <canvas ref="canvas" :width="viewportWidth" :height="viewportHeight" class="crop-canvas"
          aria-label="Prévia interativa da área recortada"
          @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="stopDrag" @pointercancel="stopDrag" />
        <div class="zoom-row">
          <label for="crop-image-zoom">Zoom</label>
          <button type="button" aria-label="Diminuir zoom" @click="zoom = Math.max(1, +(zoom - 0.1).toFixed(2))">−</button>
          <input id="crop-image-zoom" v-model.number="zoom" type="range" min="1" max="3" step="0.05" />
          <button type="button" aria-label="Aumentar zoom" @click="zoom = Math.min(3, +(zoom + 0.1).toFixed(2))">+</button>
          <button type="button" @click="reset">Redefinir</button>
        </div>
        <footer class="crop-actions">
          <button type="button" class="button-outline" @click="cancel">Cancelar</button>
          <button type="button" class="button" @click="confirm">Confirmar recorte</button>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.image-picker { display: grid; gap: .6rem; margin: .8rem 0; }
.picker-label { font-size: .95rem; font-weight: 700; }
.picker-actions { display: flex; flex-wrap: wrap; gap: .6rem; }
.picker-actions button { padding: .65rem 1rem; }
.visually-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.selected-preview { max-width: 200px; max-height: 150px; object-fit: contain; border-radius: 12px; border: 1px solid var(--color-border); }
.selection-name { font-size: .8rem; margin: 0; overflow-wrap: anywhere; }
.picker-backdrop { position: fixed; inset: 0; z-index: 160; padding: 1rem; background: #1f1522a6; display: grid; place-items: center; }
.picker-sheet, .crop-dialog { background: white; color: var(--color-text); border-radius: 18px; box-shadow: 0 20px 60px #0004; width: min(500px, 100%); padding: 1.25rem; max-height: 90dvh; overflow: auto; }
.picker-sheet { display: grid; gap: .65rem; }
.picker-sheet button { min-height: 48px; padding: .75rem; border-radius: 10px; border: 1px solid var(--color-border); background: var(--color-surface); text-align: left; display: flex; gap: 1rem; align-items: center; }
.crop-dialog header { display: flex; align-items: center; justify-content: space-between; }
.crop-dialog h3 { margin: .25rem 0; }
.crop-dialog header button { background: none; border: 0; font-size: 1.4rem; }
.crop-canvas { display: block; max-width: 100%; width: 100%; height: auto; border-radius: 12px; background: #f5edf0; touch-action: none; cursor: grab; }
.crop-canvas:active { cursor: grabbing; }
.zoom-row { display: flex; align-items: center; gap: .55rem; margin: 1rem 0; }
.zoom-row input { flex: 1; min-width: 0; accent-color: var(--color-primary); }
.zoom-row button { background: white; border: 1px solid var(--color-border); border-radius: 7px; min-width: 30px; min-height: 35px; }
.crop-actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: .6rem; }
@media (max-width: 600px) { .picker-backdrop:has(.picker-sheet) { align-items: end; padding: 0; } .picker-sheet { border-radius: 20px 20px 0 0; padding-bottom: max(1.25rem, env(safe-area-inset-bottom)); } }
</style>
