import { defineStore } from "pinia";
import { ref } from "vue";
import { catalogApi } from "../api/catalogApi";
import { apiMessage } from "../utils/catalog";

export const useCatalogStore = defineStore("catalog", () => {
  const categories = ref([]);
  const products = ref([]);
  const totalPages = ref(1);
  const loading = ref(false);
  const error = ref("");

  async function loadCategories() {
    const { data } = await catalogApi.categories();
    categories.value = data.results ?? data;
  }

  async function loadProducts(params = {}) {
    loading.value = true;
    error.value = "";
    try {
      const { data } = await catalogApi.products(params);
      products.value = data.results ?? data;
      totalPages.value = data.total_pages ?? 1;
    } catch (err) {
      products.value = [];
      error.value = apiMessage(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    products,
    totalPages,
    loading,
    error,
    loadCategories,
    loadProducts,
  };
});
