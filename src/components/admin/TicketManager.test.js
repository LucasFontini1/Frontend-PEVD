import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TicketManager from './TicketManager.vue'

const ticket = {
  id: 3, user: 8, subject: 'Dúvida sobre encomenda', status: 'aberto',
  updated_at: '2026-11-20T12:00:00Z',
  messages: [
    { id: 11, sender: 8, body: 'Qual é o prazo?', created_at: '2026-11-20T12:00:00Z' },
  ],
}
vi.mock('../../api/commercialApi', () => ({
  commercialApi: {
    tickets: vi.fn(async () => ({ data: { results: [{ ...ticket }] } })),
    ticketDetail: vi.fn(async () => ({ data: { ...ticket } })),
    reply: vi.fn(async () => ({ data: {} })),
    closeTicket: vi.fn(async () => ({ data: {} })),
  },
}))
import { commercialApi } from '../../api/commercialApi'

describe('TicketManager', () => {
  beforeEach(() => vi.clearAllMocks())

  it('abre a conversa dentro do card, mostra mensagens e permite recolher', async () => {
    const wrapper = mount(TicketManager)
    await flushPromises()
    expect(wrapper.find('.conversation').exists()).toBe(false)
    const open = wrapper.find('button[aria-expanded]')
    await open.trigger('click')
    await flushPromises()
    expect(commercialApi.ticketDetail).toHaveBeenCalledWith(3)
    expect(wrapper.find('.conversation').exists()).toBe(true)
    expect(wrapper.text()).toContain('Qual é o prazo?')
    expect(wrapper.find('button[aria-expanded]').attributes('aria-expanded')).toBe('true')
    await wrapper.find('button[aria-expanded]').trigger('click')
    expect(wrapper.find('.conversation').exists()).toBe(false)
  })

  it('envia resposta, recarrega histórico e mantém a conversa aberta', async () => {
    const wrapper = mount(TicketManager)
    await flushPromises()
    await wrapper.find('button[aria-expanded]').trigger('click')
    await flushPromises()
    await wrapper.find('textarea').setValue('Podemos combinar o horário.')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(commercialApi.reply).toHaveBeenCalledWith(3, 'Podemos combinar o horário.', false)
    expect(commercialApi.ticketDetail).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.conversation').exists()).toBe(true)
  })
})
