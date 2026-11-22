import { describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import ManualOrderForm from "./ManualOrderForm.vue";

vi.mock("../../api/catalogApi", () => ({
  catalogApi: {
    products: vi.fn(async () => ({
      data: {
        results: [
          {
            id: 4,
            slug: "brigadeiro",
            name: "Brigadeiro",
            effective_price: "5.00",
            is_available: true,
            minimum_quantity: 1,
            option_groups: [],
          },
        ],
      },
    })),
  },
}));
vi.mock("../../api/orderApi", () => ({
  orderApi: {
    adminManualOrder: vi.fn(async () => ({
      data: { public_id: "pedido-exemplo" },
    })),
  },
}));
import { orderApi } from "../../api/orderApi";

describe("ManualOrderForm", () => {
  it("envia pedido WhatsApp sem preço, status ou pagamento fornecido pelo navegador", async () => {
    const wrapper = mount(ManualOrderForm);
    await flushPromises();
    expect(wrapper.text()).toContain("Brigadeiro");
    await wrapper.find("input").setValue("Maria Silva");
    await wrapper.find("input[type=tel]").setValue("47999998888");
    await wrapper
      .find("input[type=datetime-local]")
      .setValue("2030-11-20T12:30");
    await wrapper.find(".product-select").trigger("click");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(orderApi.adminManualOrder).toHaveBeenCalledOnce();
    const payload = orderApi.adminManualOrder.mock.calls[0][0];
    expect(payload.customer_name).toBe("Maria Silva");
    expect(payload.customer_phone).toBe("47999998888");
    expect(payload.items).toEqual([
      { product_id: 4, quantity: 1, selected_option_ids: [] },
    ]);
    expect(payload).not.toHaveProperty("price");
    expect(payload).not.toHaveProperty("total");
    expect(payload).not.toHaveProperty("payment_status");
    expect(payload).not.toHaveProperty("status");
    expect(wrapper.emitted("created")).toHaveLength(1);
  });
});
