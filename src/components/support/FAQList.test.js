import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import FAQList from "./FAQList.vue";

vi.mock("../../api/supportApi", () => ({
  supportApi: {
    faqs: vi.fn(async () => ({
      data: {
        results: [
          {
            id: 1,
            question: "Como encomendar?",
            answer: "Faça um pedido pelo site.",
          },
          {
            id: 2,
            question: "Como funciona retirada?",
            answer: "Depende dos horários cadastrados.",
          },
        ],
      },
    })),
  },
}));

describe("FAQList", () => {
  beforeEach(() => vi.clearAllMocks());
  it("consulta API e filtra perguntas pelo texto", async () => {
    const wrapper = mount(FAQList);
    await flushPromises();
    expect(wrapper.findAll("details")).toHaveLength(2);
    await wrapper.find("input[type=search]").setValue("retirada");
    expect(wrapper.findAll("details")).toHaveLength(1);
    expect(wrapper.text()).toContain("Como funciona retirada?");
  });
});
