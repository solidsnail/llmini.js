import type { TypeConfig } from "../../types";

export type TypePretrained = "Voxtral" | "Ultravox";

export type TypeModelName =
  | "Voxtral-Mini-3B-2507-ONNX"
  | "ultravox-v0_5-llama-3_2-1b-ONNX"
  | "Voxtral-Mini-3B-2507_timestamped"
  | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "Voxtral-Mini-3B-2507-ONNX": {
    modelFileName: "model",
    dtype: {
      embed_tokens: "fp16", // "fp32", "fp16", "q8", "q4"
      audio_encoder: "q4", // "fp32", "fp16", "q8", "q4", "q4f16"
      decoder_model_merged: "q4", // "q4", "q4f16"
    },
    name: "onnx-community/Voxtral-Mini-3B-2507-ONNX",
    pretrained: "Voxtral",
    subfolder: "onnx",
    device: "webgpu",
  },
  "ultravox-v0_5-llama-3_2-1b-ONNX": {
    modelFileName: "model",
    dtype: {
      embed_tokens: "fp32", // "fp32", "fp16", "q8"
      audio_encoder: "q4", // "fp32", "fp16", "q8", "q4", "q4f16"
      decoder_model_merged: "q4", // "q8", "q4", "q4f16"
    },
    name: "onnx-community/ultravox-v0_5-llama-3_2-1b-ONNX",
    pretrained: "Ultravox",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Voxtral-Mini-3B-2507_timestamped": {
    modelFileName: "model",
    dtype: {
      embed_tokens: "fp16", // "fp32", "fp16", "q8", "q4"
      audio_encoder: "q4", // "fp32", "fp16", "q8", "q4", "q4f16"
      decoder_model_merged: "q4", // "q4", "q4f16"
    },
    name: "urroxyz/Voxtral-Mini-3B-2507_timestamped",
    pretrained: "Voxtral",
    subfolder: "onnx",
    device: "webgpu",
  },
};
