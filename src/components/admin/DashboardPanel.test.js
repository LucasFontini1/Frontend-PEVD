import { describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DashboardPanel from './DashboardPanel.vue'

vi.mock('../../api/commercialApi', () => ({
  commercialApi: { dashboard: vi.fn(async () => ({ data: {
    orders_count: 0, paid_orders_count: 0, contacts_count: 0,
    open_tickets_count: 0, quotes_pending_count: 0,
    recorded_paid_revenue: '0.00', top_products: [],
  } })) },
}))

describe('DashboardPanel', () => {
  it('mostra zeros reais da API sem dados simulados', async () => {
    const wrapper = mount(DashboardPanel)
    await flushPromises()
    expect(wrapper.text()).toContain('R$')
    expect(wrapper.text()).toContain('0,00')
    expect(wrapper.text()).toContain('Sem itens no período')
  })
})
