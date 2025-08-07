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
