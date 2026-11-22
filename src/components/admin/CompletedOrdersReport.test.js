import { describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import CompletedOrdersReport from "./CompletedOrdersReport.vue";

vi.mock("../../api/orderApi", () => ({
  orderApi: {
    adminCompletedReport: vi.fn(async () => ({
      data: {
        orders_count: 2,
        paid_count: 1,
        unpaid_count: 1,
        paid_total: "40.00",
        unpaid_total: "20.00",
        results: [
          {
            public_id: "abcdef12-1234-1234-1234-123456789012",
            customer_name: "Maria",
            source: "whatsapp",
            payment_status: "pago",
            total: "40.00",
            created_at: "2026-11-20T09:00:00Z",
            completed_at: "2026-11-21T10:00:00Z",
          },
        ],
      },
    })),
  },
}));

describe("CompletedOrdersReport", () => {
  it("usa apenas totais fornecidos pelo backend", async () => {
    const wrapper = mount(CompletedOrdersReport);
    await flushPromises();
    expect(wrapper.text()).toContain("2");
    expect(wrapper.text()).toContain("40,00");
    expect(wrapper.text()).toContain("20,00");
    expect(wrapper.text()).toContain("Maria");
    expect(wrapper.text()).toContain("WhatsApp".toLowerCase());
  });
});
