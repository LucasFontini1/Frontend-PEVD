import { api } from './config'

export const orderApi = {
  schedule: () => api.get('schedule/'),
  quote: payload => api.post('orders/quote/', payload),
  submit: payload => api.post('orders/', payload),
  orders: () => api.get('orders/'),
  detail: code => api.get(`orders/${encodeURIComponent(code)}/`),
  cancel: code => api.post(`orders/${encodeURIComponent(code)}/cancel-request/`),
  addresses: () => api.get('addresses/'),
  addAddress: payload => api.post('addresses/', payload),
  updateAddress: (id, payload) => api.patch(`addresses/${id}/`, payload),
  deleteAddress: id => api.delete(`addresses/${id}/`),
  adminOrders: params => api.get('admin/orders/', { params }),
  adminManualOrder: payload => api.post('admin/orders/manual/', payload),
  adminCompletedReport: params => api.get('admin/orders/completed-report/', { params }),
  adminCompletedCsv: params => api.get('admin/orders/completed-report/', {
    params: { ...params, download: 'csv' }, responseType: 'blob',
  }),
  adminTransition: (id, status, reason) => api.post(`admin/orders/${id}/transitions/`, { status, reason }),
  adminPayment: (id, reason) => api.post(`admin/orders/${id}/confirm-payment/`, { reason }),
  businessHours: () => api.get('admin/business-hours/'),
  createBusinessHour: payload => api.post('admin/business-hours/', payload),
  blockedDates: () => api.get('admin/blocked-dates/'),
  createBlockedDate: payload => api.post('admin/blocked-dates/', payload),
  deliveryZones: () => api.get('admin/delivery-zones/'),
  createDeliveryZone: payload => api.post('admin/delivery-zones/', payload),
}
