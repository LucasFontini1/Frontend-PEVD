import { api } from './config'

export const catalogApi = {
  categories: () => api.get('categories/'),
  products: (params = {}) => api.get('products/', { params }),
  product: slug => api.get(`products/${encodeURIComponent(slug)}/`),
}
