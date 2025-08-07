import type { TypeConfig } from "../../types";

export type TypePretrained = "default-type" | "MultiModalityCausalLM";
export type TypeModelName = "Janus-Pro-1B-ONNX" | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "Janus-Pro-1B-ONNX": {
    modelFileName: "model",
    dtype: {
      prepare_inputs_embeds: "q4",
      language_model: "q4f16",
      lm_head: "fp16",
      gen_head: "fp16",
      gen_img_embeds: "fp16",
      image_decode: "fp32",
    },
    name: "onnx-community/Janus-Pro-1B-ONNX",
    pretrained: "MultiModalityCausalLM",
    subfolder: "onnx",
    device: "webgpu",
  },
};
