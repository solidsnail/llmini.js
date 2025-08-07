import type { TypeConfig } from "../../types";

export type TypePretrained = "pipeline" | "Auto" | "MobileViT";

export type TypeModelName =
  | "vit-base-nsfw-detector"
  | "vit-age-classifier"
  | "detection-model-3-ONNX"
  | "detection-model-5-ONNX"
  | "detection-model-7-ONNX"
  | "dinov2-with-registers-small-with-attentions"
  | "resnet-18"
  | "resnet-152"
  | "mobilenetv4s-webnn"
  | "mobilenet_v2_1.4_224"
  | "convnext-tiny-224"
  | "resnet-50-ONNX"
  | "gender-classification-ONNX"
  | "facial_emotions_image_detection"
  | "fairface_gender_image_detection-ONNX"
  | "fairface_age_image_detection-ONNX"
  | "Fire-Detection-Engine-ONNX"
  | "Vit-Mature-Content-Detection-ONNX"
  | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "vit-base-nsfw-detector": {
    modelFileName: "model",
    dtype: "auto",
    name: "AdamCodd/vit-base-nsfw-detector",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "vit-age-classifier": {
    modelFileName: "model",
    dtype: "auto",
    name: "jdp8/vit-age-classifier",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "detection-model-3-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "LPX55/detection-model-3-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "detection-model-5-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "LPX55/detection-model-5-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "detection-model-7-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "LPX55/detection-model-7-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "dinov2-with-registers-small-with-attentions": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/dinov2-with-registers-small-with-attentions",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "resnet-18": {
    modelFileName: "model",
    dtype: "q4",
    name: "Xenova/resnet-18",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "resnet-152": {
    modelFileName: "model",
    dtype: "q4",
    name: "Xenova/resnet-152",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "mobilenetv4s-webnn": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/mobilenetv4s-webnn",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "mobilenet_v2_1.4_224": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/mobilenet_v2_1.4_224",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "convnext-tiny-224": {
    modelFileName: "model",
    dtype: "q4",
    name: "Xenova/convnext-tiny-224",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "resnet-50-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/resnet-50-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "gender-classification-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/gender-classification-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  facial_emotions_image_detection: {
    modelFileName: "model",
    dtype: "q4",
    name: "Xenova/facial_emotions_image_detection",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "fairface_gender_image_detection-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/fairface_gender_image_detection-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "fairface_age_image_detection-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/fairface_age_image_detection-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Fire-Detection-Engine-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "prithivMLmods/Fire-Detection-Engine-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
  "Vit-Mature-Content-Detection-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "prithivMLmods/Vit-Mature-Content-Detection-ONNX",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  },
};
