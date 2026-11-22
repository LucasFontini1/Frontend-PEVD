export const currency = value => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
}).format(Number(value))

export function imageUrl(image) {
  const url = image?.url
  if (!url) return null
  if (/^https:\/\//.test(url)) return url
  if (!url.startsWith('/')) return null
  const base = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/'
  return new URL(url, base).href
}

export function apiMessage(error) {
  const data = error?.response?.data
  if (!data) return 'Falha de comunicação com a loja. Tente novamente.'
  if (typeof data.detail === 'string') return data.detail
  return Object.values(data).flat().map(String).join(' ') || 'Não foi possível concluir.'
}
