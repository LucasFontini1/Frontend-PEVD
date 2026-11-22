import { api } from './config'

export const brandApi = {
  get: () => api.get('shop/settings/'),
  adminGet: () => api.get('admin/shop-settings/'),
  update: data => api.patch('admin/shop-settings/', data),
}
