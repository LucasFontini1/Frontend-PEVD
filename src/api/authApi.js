import { api, sessionApi } from './config'
export const authApi = {
  register: payload => sessionApi.post('registro/', payload),
  login: payload => sessionApi.post('token/', payload),
  getProfile: () => api.get('usuarios/me/'),
  adminAccess: () => api.get('admin/access/'),
}
