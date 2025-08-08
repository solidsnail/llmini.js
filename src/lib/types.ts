import { type ProgressInfo } from "@huggingface/transformers";
import type { AudioTextToTextModel } from "./categories/audio-text-to-text/model";
import type { ChatModel } from "./categories/chat/model";
import type { TextToSpeechModel } from "./categories/text-to-speech/model";
import type { DepthEstimationModel } from "./categories/depth-estimation/model";
import type { DocumentQuestionAnsweringModel } from "./categories/document-question-answering/model";
import type { ImageClassificationModel } from "./categories/image-classification/model";
import type { ImageTextToTextModel } from "./categories/image-text-to-text/model";
import type { ObjectDetectionModel } from "./categories/object-detection/model";

export type TypeDTypeSingle =
  | "auto"
  | "fp32"
  | "fp16"
  | "q8"
  | "int8"
  | "uint8"
  | "q4"
  | "bnb4"
  | "q4f16";
export type TypeDType =
  | TypeDTypeSingle
  | Partial<{
      prepare_inputs_embeds: TypeDTypeSingle;
      language_model: TypeDTypeSingle;
      lm_head: TypeDTypeSingle;
      gen_head: TypeDTypeSingle;
      gen_img_embeds: TypeDTypeSingle;
      image_decode: TypeDTypeSingle;
      embed_tokens: TypeDTypeSingle;
      audio_encoder: TypeDTypeSingle;
      vision_encoder: TypeDTypeSingle;
      encoder_model: TypeDTypeSingle;
      decoder_model_merged: TypeDTypeSingle;
    }>;

export type TypeDeviceSingle =
  | "auto"
  | "gpu"
  | "cpu"
  | "wasm"
  | "webgpu"
  | "cuda"
  | "dml"
  | "webnn"
  | "webnn-npu"
  | "webnn-gpu"
  | "webnn-cpu";
export type TypeDevice =
  | TypeDeviceSingle
  | Partial<{
      prepare_inputs_embeds: TypeDeviceSingle;
      language_model: TypeDeviceSingle;
      lm_head: TypeDeviceSingle;
      gen_head: TypeDeviceSingle;
      gen_img_embeds: TypeDeviceSingle;
      image_decode: TypeDeviceSingle;
      embed_tokens: TypeDeviceSingle;
    }>;
export type TypeConfig<N extends string, P extends string> = Record<
  N,
  {
    modelFileName: string;
    dtype: TypeDType;
    device: TypeDevice;
    name: string;
    pretrained: P;
    subfolder: string;
  }
>;
export type TypeProgress = ProgressInfo;
export type TypeModel =
  | AudioTextToTextModel
  | ChatModel
  | TextToSpeechModel
  | DepthEstimationModel
  | DocumentQuestionAnsweringModel
  | ImageClassificationModel
  | ImageTextToTextModel
  | ObjectDetectionModel;
