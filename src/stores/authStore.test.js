import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from './authStore'
import { authApi } from '../api/authApi'
import { renewSession } from '../api/config'

vi.mock('../api/authApi', () => ({
  authApi: {
    login: vi.fn(), getProfile: vi.fn(),
    register: vi.fn(), adminAccess: vi.fn(),
  },
}))
vi.mock('../api/config', () => ({
  endSession: vi.fn(async () => {}),
  renewSession: vi.fn(async () => {}),
  setAccessToken: vi.fn(),
}))

describe('authStore', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); setActivePinia(createPinia()) })
  it('não considera uma conta autenticada sem perfil confirmado', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
  it('restaura a conta na recarga pelo cookie HttpOnly sem salvar token local', async () => {
    authApi.getProfile.mockResolvedValue({ data: { id: 7, email: 'a@a.com' } })
    const store = useAuthStore()
    await Promise.all([store.hydrate(), store.hydrate()])
    expect(store.isAuthenticated).toBe(true)
    expect(store.user.email).toBe('a@a.com')
    expect(renewSession).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('access_token')).toBeNull()
  })
  it('limpa a sessão ao sair', async () => {
    const store = useAuthStore()
    store.user = { id: 3 }
    await store.logout()
    expect(store.user).toBeNull()
  })
})
