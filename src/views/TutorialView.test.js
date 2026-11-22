import { describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import TutorialView from "./TutorialView.vue";

vi.mock("../stores/authStore", () => ({
  useAuthStore: () => ({ user: { is_superuser: true } }),
}));

describe("TutorialView", () => {
  it("exibe passos para clientes e administração e filtra o texto", async () => {
    const wrapper = mount(TutorialView, {
      global: { stubs: { RouterLink: { template: "<a><slot /></a>" } } },
    });
    expect(wrapper.text()).toContain("Explore o cardápio");
    const choices = wrapper.findAll(".switcher button");
    await choices[1].trigger("click");
    expect(wrapper.text()).toContain("Pedidos recebidos pelo WhatsApp");
    await wrapper.find("input[type=search]").setValue("relatórios");
    await flushPromises();
    expect(wrapper.findAll(".step")).toHaveLength(1);
    expect(wrapper.text()).toContain("exporte em CSV");
  });
});
