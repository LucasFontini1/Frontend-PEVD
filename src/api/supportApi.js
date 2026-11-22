import { api } from './config'

export const supportApi = {
  faqs: params => api.get('faqs/', { params }),
  banners: () => api.get('banners/'),
  contact: payload => api.post('contact/', payload),
  tickets: () => api.get('support/tickets/'),
  ticket: id => api.get(`support/tickets/${id}/`),
  newTicket: payload => api.post('support/tickets/', payload),
  message: (id, message) => api.post(`support/tickets/${id}/messages/`, { message }),
  quotes: () => api.get('quotes/'),
  newQuote: payload => api.post('quotes/', payload),
  acceptQuote: id => api.post(`quotes/${id}/accept/`),
  declineQuote: id => api.post(`quotes/${id}/decline/`),
}
