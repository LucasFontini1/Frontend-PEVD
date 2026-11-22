import axios from 'axios'
import { toast, setOverlay } from '../utils/feedback'
// Em DEV, manter a mesma hostname do Vite para o cookie SameSite=Lax funcionar.
const localHost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? window.location.hostname : '127.0.0.1'
const baseURL = import.meta.env.VITE_API_BASE_URL ||
  `http://${localHost}:8000/api/`
export const api = axios.create({ baseURL, withCredentials: true })
export const sessionApi = axios.create({ baseURL, withCredentials: true })
let accessToken = null
let refreshing = null
export function setAccessToken(token) { accessToken = token || null }
function getCsrfToken() {
  return document.cookie.split('; ').find(x => x.startsWith('pv_csrf='))?.split('=').slice(1).join('=') || ''
}
export function csrfHeader() { return { 'X-CSRFToken': getCsrfToken() } }
export async function renewSession() {
  if (!refreshing) {
    refreshing = sessionApi.post('token/refresh/', {}, { headers: csrfHeader() })
      .then(({ data }) => { setAccessToken(data.access); return data.access })
      .finally(() => { refreshing = null })
  }
  return refreshing
}
export async function endSession() {
  try { await sessionApi.post('token/logout/', {}, { headers: csrfHeader() }) }
  finally { setAccessToken(null) }
}
api.interceptors.request.use(config => {
  if (config.method && config.method !== 'get') { config._showOverlay = true; setOverlay(true) }
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})
api.interceptors.response.use(response => {
  if (response.config._showOverlay) setOverlay(false)
  return response
}, async error => {
  if (error.config?._showOverlay) { setOverlay(false); error.config._showOverlay = false }
  if (error.response?.status !== 401) toast(error.response?.data?.detail || 'Não foi possível concluir a operação.', 'error')
  const original = error.config
  if (error.response?.status !== 401 || !original || original._retry ||
      original.url?.includes('token/') || original.url?.includes('registro/')) throw error
  original._retry = true
  try {
    const token = await renewSession()
    original.headers.Authorization = `Bearer ${token}`
    return await api(original)
  } catch (refreshError) { setAccessToken(null); throw refreshError }
})
