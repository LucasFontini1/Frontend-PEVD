import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from './cartStore'

describe('cartStore', () => {
  beforeEach(() => { localStorage.clear(); setActivePinia(createPinia()) })

  it('guarda IDs, quantidades, opções e observações, sem preço', async () => {
    const cart = useCartStore()
    cart.add(8, 2, [3, 1])
    expect(cart.lines[0]).toEqual({ product_id: 8, quantity: 2, selected_option_ids: [1, 3], observation: '' })
    expect(JSON.stringify(cart.lines)).not.toContain('price')
  })

  it('preserva observações diferentes em linhas distintas', () => {
    const cart = useCartStore()
    cart.add(8, 1, [], 'Sem cobertura')
    cart.add(8, 1, [], 'Com bilhete')
    expect(cart.lines).toHaveLength(2)
    expect(cart.lines[0].observation).toBe('Sem cobertura')
  })

  it('une linhas de mesma combinação e separa opções diferentes', () => {
    const cart = useCartStore()
    cart.add(8, 2, [2])
    cart.add(8, 1, [2])
    cart.add(8, 2, [1])
    expect(cart.lines.length).toBe(2)
    expect(cart.lines[0].quantity).toBe(3)
    expect(cart.count).toBe(5)
    cart.remove(0)
    expect(cart.lines.length).toBe(1)
  })

  it('não permite quantidades inválidas nem preço arbitrário', () => {
    const cart = useCartStore()
    expect(() => cart.add(9, -1, [])).toThrow()
    expect(() => cart.add('abc', 2, [])).toThrow()
    expect(cart.lines).toHaveLength(0)
  })

  it('recupera carrinho salvo após reinicializar a store', async () => {
    const cart = useCartStore()
    cart.add(4, 1, [])
    await Promise.resolve()
    setActivePinia(createPinia())
    expect(useCartStore().lines[0].product_id).toBe(4)
  })
})
