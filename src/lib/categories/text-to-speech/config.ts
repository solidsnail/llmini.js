import type { TypeConfig } from "../../types";
import type { GenerateOptions } from "kokoro-js";

export type TypePretrained = "default-type" | "Kokoro" | "Outetts";

export type TypeModelName =
  | "Kokoro-82M-v1.0-ONNX"
  | "OuteTTS-0.2-500M"
  | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
  "Kokoro-82M-v1.0-ONNX": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/Kokoro-82M-v1.0-ONNX",
    pretrained: "Kokoro",
    subfolder: "onnx",
    device: "wasm", // webgpu causes noise in audio
  },
  "OuteTTS-0.2-500M": {
    modelFileName: "model",
    dtype: "q4",
    name: "onnx-community/OuteTTS-0.2-500M",
    pretrained: "Outetts",
    subfolder: "onnx",
    device: "webgpu",
  },
};
export type TypeKokoroVoice = GenerateOptions["voice"];
export type TypeOutettsVoice =
  | "male_1"
  | "male_2"
  | "male_3"
  | "male_4"
  | "female_1"
  | "female_2";

export const kokoroVoicesOptions = [
  { label: "heart", value: "af_heart" },
  { label: "alloy", value: "af_alloy" },
  { label: "aoede", value: "af_aoede" },
  { label: "bella", value: "af_bella" },
  { label: "jessica", value: "af_jessica" },
  { label: "kore", value: "af_kore" },
  { label: "nicole", value: "af_nicole" },
  { label: "nova", value: "af_nova" },
  { label: "river", value: "af_river" },
  { label: "sarah", value: "af_sarah" },
  { label: "sky", value: "af_sky" },
  { label: "adam", value: "am_adam" },
  { label: "echo", value: "am_echo" },
  { label: "eric", value: "am_eric" },
  { label: "fenrir", value: "am_fenrir" },
  { label: "liam", value: "am_liam" },
  { label: "michael", value: "am_michael" },
  { label: "onyx", value: "am_onyx" },
  { label: "puck", value: "am_puck" },
  { label: "santa", value: "am_santa" },
  { label: "emma", value: "bf_emma" },
  { label: "isabella", value: "bf_isabella" },
  { label: "george", value: "bm_george" },
  { label: "lewis", value: "bm_lewis" },
  { label: "alice", value: "bf_alice" },
  { label: "lily", value: "bf_lily" },
  { label: "daniel", value: "bm_daniel" },
  { label: "fable", value: "bm_fable" },
];

export const outettsVoicesOptions = [
  { label: "male 1", value: "male_1" },
  { label: "male 2", value: "male_2" },
  { label: "male 3", value: "male_3" },
  { label: "male 4", value: "male_4" },
  { label: "female 1", value: "female_1" },
  { label: "female 2", value: "female_2" },
];
