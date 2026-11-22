import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";

vi.mock("vue-router", () => ({ useRouter: () => ({ push: vi.fn() }) }));

import AddToCartForm from "./AddToCartForm.vue";

describe("AddToCartForm", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("inicia quantidades e seleções sem erro e exige grupo obrigatório", async () => {
    const product = {
      id: 10,
      minimum_quantity: 2,
      is_available: true,
      option_groups: [
        {
          id: 1,
          name: "Tamanho",
          required: true,
          multiple: true,
          options: [{ id: 3, name: "Grande" }],
        },
      ],
    };
    const wrapper = mount(AddToCartForm, { props: { product } });
    expect(wrapper.find("input[type=number]").element.value).toBe("2");
    await wrapper.find("form").trigger("submit");
    expect(wrapper.text()).toContain("Escolha uma opção de Tamanho");
  });
});
