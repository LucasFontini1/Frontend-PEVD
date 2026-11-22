import { describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ContactView from "./ContactView.vue";

vi.mock("../api/supportApi", () => ({
  supportApi: {
    contact: vi.fn(async () => ({ data: { message: "Recebido" } })),
  },
}));
import { supportApi } from "../api/supportApi";

describe("ContactView", () => {
  it("envia formulário para a API e só depois confirma recebimento", async () => {
    const wrapper = mount(ContactView, {
      global: { stubs: { RouterLink: { template: "<a><slot /></a>" } } },
    });
    expect(wrapper.text()).not.toContain("Mensagem recebida");
    const fields = wrapper.findAll("input");
    await fields[0].setValue("Maria");
    await fields[1].setValue("maria@example.com");
    await fields[2].setValue("Dúvida encomenda");
    await wrapper
      .find("textarea")
      .setValue("Preciso de mais informações sobre o pedido.");
    const consent = wrapper.find("input[type=checkbox]");
    await consent.setValue(true);
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(supportApi.contact).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Mensagem recebida");
  });
});
