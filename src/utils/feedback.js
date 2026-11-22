export function toast(message, type = "success", action = null) {
  window.dispatchEvent(
    new CustomEvent("pevd:toast", { detail: { message, type, action } }),
  );
}
export function setOverlay(visible) {
  window.dispatchEvent(
    new CustomEvent("pevd:overlay", { detail: { visible } }),
  );
}
