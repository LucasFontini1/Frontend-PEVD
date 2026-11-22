import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from './ProductCard.vue'

describe('ProductCard', () => {
  it('exibe nome, preço real retornado e link por slug', () => {
    const product = {
      id: 1, slug: 'produto-real', name: 'Produto exemplo',
      category: { name: 'Categoria exemplo' }, effective_price: '12.30',
      unit: 'unidade', is_available: true, images: [],
    }
    const wrapper = mount(ProductCard, {
      props: { product },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    expect(wrapper.text()).toContain('Produto exemplo')
    expect(wrapper.text()).toContain('12,30')
    expect(wrapper.text()).toContain('Foto ainda não cadastrada')
  })
})
