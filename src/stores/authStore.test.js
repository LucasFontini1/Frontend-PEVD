import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from './authStore'

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
  beforeEach(() => setActivePinia(createPinia()))
  it('não considera uma conta autenticada sem perfil confirmado', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
  it('limpa a sessão ao sair', async () => {
    const store = useAuthStore()
    store.user = { id: 3 }
    await store.logout()
    expect(store.user).toBeNull()
  })
})
