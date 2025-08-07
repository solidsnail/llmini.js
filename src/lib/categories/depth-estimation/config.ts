import type { TypeConfig } from "../../types";

export type TypePretrained = "pipeline" | "Auto";

export type TypeModelName =
  | "depth-anything-small-hf"
  | "depth-anything-v2-small"
  | "dpt-large"
  | "dpt-hybrid-midas"
  | "depth-anything-v2-base"
  | "depth-anything-base-hf"
  | "DepthPro-ONNX"
  | "depth-anything-large-hf"
  | "depth-anything-v2-large"
  | "metric3d-vit-small"
  | "glpn-kitti"
  | "glpn-nyu"
  | "dpt-dinov2-base-kitti"
  | "metric3d-vit-large"
  | "dpt-dinov2-large-nyu"
  | "DepthSmall"
  | "dpt-dinov2-small-kitti"
  | "promptda_vits_transparent_hf"
  | "promptda_vits_hf"
  | "metric3d-vit-giant2"
  | "dpt-dinov2-small-nyu"
  | "dpt-dinov2-base-nyu"
  | "dpt-dinov2-large-kitti"
  | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "depth-anything-small-hf": {
    modelFileName: "model",
    dtype: "auto",
    name: "Xenova/depth-anything-small-hf",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "depth-anything-v2-small": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/depth-anything-v2-small",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-large": {
    modelFileName: "model",
    dtype: "auto",
    name: "Xenova/dpt-large",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-hybrid-midas": {
    modelFileName: "model",
    dtype: "auto",
    name: "Xenova/dpt-hybrid-midas",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "depth-anything-v2-base": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/depth-anything-v2-base",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "depth-anything-base-hf": {
    modelFileName: "model",
    dtype: "auto",
    name: "Xenova/depth-anything-base-hf",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "DepthPro-ONNX": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/DepthPro-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "depth-anything-large-hf": {
    modelFileName: "model",
    dtype: "auto",
    name: "Xenova/depth-anything-large-hf",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "depth-anything-v2-large": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/depth-anything-v2-large",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "metric3d-vit-small": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/metric3d-vit-small",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "glpn-kitti": {
    modelFileName: "model",
    dtype: "auto",
    name: "Xenova/glpn-kitti",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "glpn-nyu": {
    modelFileName: "model",
    dtype: "auto",
    name: "Xenova/glpn-nyu",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-dinov2-base-kitti": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/dpt-dinov2-base-kitti",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "metric3d-vit-large": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/metric3d-vit-large",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-dinov2-large-nyu": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/dpt-dinov2-large-nyu",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  DepthSmall: {
    modelFileName: "model",
    dtype: "auto",
    name: "a414166402/DepthSmall",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-dinov2-small-kitti": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/dpt-dinov2-small-kitti",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  promptda_vits_transparent_hf: {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/promptda_vits_transparent_hf",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  promptda_vits_hf: {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/promptda_vits_hf",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "metric3d-vit-giant2": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/metric3d-vit-giant2",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-dinov2-small-nyu": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/dpt-dinov2-small-nyu",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-dinov2-base-nyu": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/dpt-dinov2-base-nyu",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dpt-dinov2-large-kitti": {
    modelFileName: "model",
    dtype: "auto",
    name: "onnx-community/dpt-dinov2-large-kitti",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
};
