import type { TypeConfig } from "../../types";

export type TypePretrained = "default-type";
export type TypeModelName = "donut-base-finetuned-docvqa" | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "donut-base-finetuned-docvqa": {
    modelFileName: "model",
    dtype: "q4",
    name: "Xenova/donut-base-finetuned-docvqa",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
};
