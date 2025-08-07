import type { TypeConfig } from "../../types";

export type TypePretrained = "Vision2Seq" | "Florence2" | "Auto";

export type TypeModelName =
  | "SmolVLM-256M-Instruct"
  | "SmolVLM-500M-Instruct"
  | "sm_doc"
  | "Florence-2-large"
  | "FastVLM-0.5B-ONNX"
  | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "SmolVLM-500M-Instruct": {
    modelFileName: "model",
    dtype: "fp32",
    name: "HuggingFaceTB/SmolVLM-500M-Instruct",
    pretrained: "Vision2Seq",
    subfolder: "onnx",
    device: "webgpu",
  },
  "SmolVLM-256M-Instruct": {
    modelFileName: "model",
    dtype: "fp32",
    name: "HuggingFaceTB/SmolVLM-256M-Instruct",
    pretrained: "Vision2Seq",
    subfolder: "onnx",
    device: "webgpu",
  },
  sm_doc: {
    modelFileName: "model",
    dtype: "fp32",
    name: "Compumacy/sm_doc",
    pretrained: "Vision2Seq",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Florence-2-large": {
    modelFileName: "model",
    dtype: {
      embed_tokens: "fp16", // or 'fp32'
      vision_encoder: "fp16", // or 'fp32'
      encoder_model: "q4",
      decoder_model_merged: "q4",
    },
    name: "onnx-community/Florence-2-large",
    pretrained: "Florence2",
    subfolder: "onnx",
    device: "webgpu",
  },
  "FastVLM-0.5B-ONNX": {
    modelFileName: "model",
    dtype: {
      embed_tokens: "fp16",
      vision_encoder: "q4",
      decoder_model_merged: "q4",
    },
    name: "onnx-community/FastVLM-0.5B-ONNX",
    pretrained: "Auto",
    subfolder: "onnx",
    device: "webgpu",
  },
};
