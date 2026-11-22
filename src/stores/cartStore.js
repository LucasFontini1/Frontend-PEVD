import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const KEY = 'pevd_cart_v1'
function clean(raw) {
  if (!Array.isArray(raw)) return []
  return raw.filter(item => Number.isSafeInteger(item.product_id) && item.product_id > 0 &&
    Number.isSafeInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100 &&
    Array.isArray(item.selected_option_ids) && item.selected_option_ids.length <= 30 &&
    item.selected_option_ids.every(id => Number.isSafeInteger(id) && id > 0))
    .slice(0, 40).map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      selected_option_ids: [...new Set(item.selected_option_ids)].sort((a, b) => a - b),
    }))
}
function readCart() {
  try { return clean(JSON.parse(localStorage.getItem(KEY) || '[]')) }
  catch { return [] }
}
export const useCartStore = defineStore('cart', () => {
  const lines = ref(readCart())
  const count = computed(() => lines.value.reduce((sum, row) => sum + row.quantity, 0))
  watch(lines, value => {
    try { localStorage.setItem(KEY, JSON.stringify(value)) }
    catch { /* storage bloqueado: mantém carrinho em memória */ }
  }, { deep: true })

  function add(productId, quantity, optionIds = []) {
    const [line] = clean([{
      product_id: Number(productId),
      quantity: Number(quantity),
      selected_option_ids: optionIds.map(Number),
    }])
    if (!line) throw new Error('Produto, opções ou quantidade inválidos.')
    const existing = lines.value.find(item =>
      item.product_id === line.product_id &&
      JSON.stringify(item.selected_option_ids) === JSON.stringify(line.selected_option_ids))
    if (existing) {
      existing.quantity = Math.min(100, existing.quantity + line.quantity)
    } else if (lines.value.length < 40) {
      lines.value.push(line)
    } else { throw new Error('Limite de itens do carrinho atingido.') }
  }
  function update(index, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) return
    if (lines.value[index]) lines.value[index].quantity = quantity
  }
  function remove(index) { lines.value.splice(index, 1) }
  function clear() { lines.value = [] }
  return { lines, count, add, update, remove, clear }
})
