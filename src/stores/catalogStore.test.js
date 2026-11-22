import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCatalogStore } from "./catalogStore";

vi.mock("../api/catalogApi", () => ({
  catalogApi: {
    categories: vi.fn(async () => ({
      data: { results: [{ id: 1, slug: "teste", name: "Teste" }] },
    })),
    products: vi.fn(async () => ({
      data: { results: [{ id: 1, name: "Produto de teste" }], total_pages: 3 },
    })),
  },
}));

describe("catalogStore", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("busca categorias persistidas pela API", async () => {
    const store = useCatalogStore();
    await store.loadCategories();
    expect(store.categories).toHaveLength(1);
    expect(store.categories[0].slug).toBe("teste");
  });

  it("recebe paginação e itens da API, sem produtos inventados", async () => {
    const store = useCatalogStore();
    expect(store.products).toEqual([]);
    await store.loadProducts({ search: "Produto" });
    expect(store.products).toHaveLength(1);
    expect(store.totalPages).toBe(3);
    expect(store.loading).toBe(false);
  });
});
