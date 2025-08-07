import type { TypeConfig } from "../../types";

export type TypePretrained = "default-type" | "MultiModalityCausalLM";

export type TypeModelName =
  | "Qwen2.5-0.5B-Instruct"
  | "Qwen2.5-Coder-0.5B-Instruct"
  | "Qwen3-0.6B-ONNX"
  | "Qwen1.5-0.5B-Chat-ONNX"
  | "Phi-3.5-mini-instruct-onnx-web"
  | "Llama-3.2-1B-Instruct-q4f16"
  | "SmolLM2-135M-Instruct"
  | "SmolLM2-360M-Instruct"
  | "SmolLM2-1.7B-Instruct"
  | "SmolLM3-3B-ONNX"
  | "DeepSeek-R1-Distill-Qwen-1.5B-ONNX"
  | "deepseek-coder-1.3b-instruct-ONNX"
  | "FastThink-0.5B-Tiny"
  | "Janus-Pro-1B-ONNX"
  | "Janus-1.3B-ONNX"
  | "LFM2-1.2B-ONNX"
  | "ZR1-1.5B-ONNX"
  | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "Qwen2.5-0.5B-Instruct": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/Qwen2.5-0.5B-Instruct",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Qwen2.5-Coder-0.5B-Instruct": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Qwen3-0.6B-ONNX": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "onnx-community/Qwen3-0.6B-ONNX",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Qwen1.5-0.5B-Chat-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/Qwen1.5-0.5B-Chat-ONNX",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Phi-3.5-mini-instruct-onnx-web": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/Phi-3.5-mini-instruct-onnx-web",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Llama-3.2-1B-Instruct-q4f16": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "onnx-community/Llama-3.2-1B-Instruct-q4f16",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "SmolLM2-135M-Instruct": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "HuggingFaceTB/SmolLM2-135M-Instruct",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "SmolLM2-360M-Instruct": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "HuggingFaceTB/SmolLM2-360M-Instruct",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "SmolLM2-1.7B-Instruct": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "HuggingFaceTB/SmolLM2-1.7B-Instruct",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "SmolLM3-3B-ONNX": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "HuggingFaceTB/SmolLM3-3B-ONNX",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "DeepSeek-R1-Distill-Qwen-1.5B-ONNX": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "deepseek-coder-1.3b-instruct-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/deepseek-coder-1.3b-instruct-ONNX",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "LFM2-1.2B-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/LFM2-1.2B-ONNX",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
  "FastThink-0.5B-Tiny": {
    modelFileName: "model",
    dtype: "q4",
    name: "prithivMLmods/FastThink-0.5B-Tiny",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
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
  "Janus-1.3B-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/Janus-1.3B-ONNX",
    pretrained: "MultiModalityCausalLM",
    subfolder: "onnx",
    device: "webgpu",
  },
  "ZR1-1.5B-ONNX": {
    modelFileName: "model",
    dtype: "q4f16",
    name: "onnx-community/ZR1-1.5B-ONNX",
    pretrained: "default-type",
    subfolder: "onnx",
    device: "webgpu",
  },
};
