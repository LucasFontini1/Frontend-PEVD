import { api } from './config'

export const commercialApi = {
  dashboard: params => api.get('admin/dashboard/', { params }),
  faqs: () => api.get('admin/faqs/', { params: { page_size: 100 } }),
  createFaq: data => api.post('admin/faqs/', data),
  updateFaq: (id, data) => api.patch(`admin/faqs/${id}/`, data),
  unpublishFaq: id => api.delete(`admin/faqs/${id}/`),
  tickets: params => api.get('admin/support/tickets/', { params }),
  reply: (id, message, close = false) =>
    api.post(`admin/support/tickets/${id}/reply/`, { message, close }),
  closeTicket: id => api.post(`admin/support/tickets/${id}/close/`),
  quotes: params => api.get('admin/quotes/', { params }),
  propose: (id, data) => api.post(`admin/quotes/${id}/propose/`, data),
  contacts: params => api.get('admin/contact/', { params }),
  markHandled: id => api.post(`admin/contact/${id}/mark-handled/`),
  banners: () => api.get('admin/banners/', { params: { page_size: 100 } }),
  createBanner: data => api.post('admin/banners/', data),
  updateBanner: (id, data) => api.patch(`admin/banners/${id}/`, data),
  unpublishBanner: id => api.delete(`admin/banners/${id}/`),
}
