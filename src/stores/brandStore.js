import { defineStore } from 'pinia'
import { ref } from 'vue'
import { brandApi } from '../api/brandApi'

const defaults = {
  name: 'Pensei em Você Doces',
  background_color: '#FFF5E9', primary_color: '#C96680', heading_color: '#704438',
  logo: null, business_email: '', phone: '', pickup_address: '', instagram_url: '',
  announcement: '', response_hours: null,
}
export const useBrandStore = defineStore('brand', () => {
  const brand = ref({ ...defaults })
  async function load() {
    try {
      const { data } = await brandApi.get()
      brand.value = { ...defaults, ...data }
      for (const [key, property] of [
        ['background_color', '--color-background'],
        ['primary_color', '--color-primary'],
        ['heading_color', '--color-heading'],
      ]) {
        if (/^#[0-9a-fA-F]{6}$/.test(brand.value[key])) {
          document.documentElement.style.setProperty(property, brand.value[key])
        }
      }
      document.title = brand.value.name
    } catch { /* Preserva os tokens padrão até que a API esteja disponível. */ }
  }
  return { brand, load }
})
