import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ImageCropInput from "./ImageCropInput.vue";

describe("ImageCropInput", () => {
  it("oferece seleção por arquivos e câmera sem enviar automaticamente", () => {
    const wrapper = mount(ImageCropInput, {
      props: { label: "Foto do produto", modelValue: null },
    });
    expect(wrapper.text()).toContain("Foto do produto");
    const fields = wrapper.findAll('input[type="file"]');
    expect(fields).toHaveLength(2);
    expect(fields[0].attributes("accept")).toContain("image/webp");
    expect(fields[1].attributes("capture")).toBe("environment");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("rejeita formatos inválidos antes do recorte", async () => {
    const wrapper = mount(ImageCropInput);
    const input = wrapper.find('input[type="file"]');
    const file = new File(["abc"], "arquivo.txt", { type: "text/plain" });
    Object.defineProperty(input.element, "files", { configurable: true, value: [file] });
    await input.trigger("change");
    expect(wrapper.text()).toContain("Escolha uma imagem PNG, JPG ou WebP.");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});
