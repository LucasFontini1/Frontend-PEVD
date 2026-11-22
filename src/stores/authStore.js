import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api/authApi'
import { endSession, renewSession, setAccessToken } from '../api/config'
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const initialized = ref(false)
  const isAuthenticated = computed(() => Boolean(user.value))
  async function hydrate() {
    if (initialized.value) return
    loading.value = true
    try { await renewSession(); user.value = (await authApi.getProfile()).data }
    catch { user.value = null; setAccessToken(null) }
    finally { initialized.value = true; loading.value = false }
  }
  async function login(login, password) {
    loading.value = true
    try {
      const { data } = await authApi.login({ login, password })
      setAccessToken(data.access)
      user.value = (await authApi.getProfile()).data
      initialized.value = true
    } finally { loading.value = false }
  }
  async function register(values) { return authApi.register(values) }
  async function logout() {
    try { await endSession() }
    finally { user.value = null; initialized.value = true }
  }
  return { user, loading, initialized, isAuthenticated, hydrate, login, register, logout }
})
