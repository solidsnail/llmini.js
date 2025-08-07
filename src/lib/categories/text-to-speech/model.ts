import {
  pipeline,
  RawAudio,
  TextToAudioPipeline,
  type PreTrainedModel,
  type ProgressInfo,
} from "@huggingface/transformers";
import { WaveFile } from "wavefile";
// import { env } from "@huggingface/transformers";

import { BaseModel } from "../../classes/base-model";
import {
  CONFIG,
  type TypeModelName,
  type TypeKokoroVoice,
  type TypeOutettsVoice,
} from "./config";
import type { TypeDevice } from "../../types";
import type { KokoroTTS } from "kokoro-js";

// env.backends.onnx.logLevel = "verbose";

export class TextToSpeechModel extends BaseModel {
  private modelName: TypeModelName;
  private generator: KokoroTTS | TextToAudioPipeline | undefined;
  private model: PreTrainedModel | undefined;

  constructor(modelName: TypeModelName) {
    super();
    this.modelName = modelName;
  }

  onProgressChange = (progressInfo: ProgressInfo) => {
    self.postMessage({
      event: "onProgressChange",
      payload: {
        progress: progressInfo,
      },
    });
  };
  uint8ToBase64 = (bytes: Uint8Array) => {
    const chunk = 0x8000;
    let binary = "",
      result = "";
    for (let i = 0; i < bytes.byteLength; i += chunk) {
      const sub = bytes.subarray(i, i + chunk);
      binary += String.fromCharCode(...sub);
    }
    result = btoa(binary);
    return result;
  };

  ttsToBase64Wav = async ({
    sampling_rate,
    audio,
  }: RawAudio): Promise<string> => {
    const wav = new WaveFile();
    wav.fromScratch(1, sampling_rate, "32f", audio);
    const wavBuf = wav.toBuffer();
    const b64 = this.uint8ToBase64(new Uint8Array(wavBuf));
    return `data:audio/wav;base64,${b64}`;
  };

  onResult = (result: string) => {
    self.postMessage({
      event: "onResult",
      payload: {
        result,
      },
    });
  };
  speak = async (
    text: string,
    voice: TypeKokoroVoice | TypeOutettsVoice = this.modelName ===
    "Kokoro-82M-v1.0-ONNX"
      ? "am_puck"
      : "male_1",
    speed = 1.3
  ) => {
    if (!this.model) {
      throw new Error("Model is not loaded");
    }
    const modelConfig = CONFIG[this.modelName];
    switch (modelConfig.pretrained) {
      case "Kokoro": {
        const generator = this.generator as KokoroTTS;
        const result = await generator.generate(text, {
          voice: voice as TypeKokoroVoice,
          speed,
        });
        const base64wav = await this.ttsToBase64Wav(result);
        this.onResult(base64wav);
        break;
      }
      case "Outetts": {
        const generator = this.generator!;
        //@ts-expect-error No dts yer for outetts
        const speaker = generator.load_default_speaker(
          voice as TypeOutettsVoice
        );
        //@ts-expect-error No dts yer for outetts
        const result = await generator.generate({
          text,
          // temperature: 0.1, // Lower temperature values may result in a more stable tone
          // repetition_penalty: 1.1,
          // max_length: 4096,
          // Optional: Use a speaker profile for consistent voice characteristics
          // Without a speaker profile, the model will generate a voice with random characteristics
          speaker,
        });
        result.audio = result.audio.data;
        result.sampling_rate = result.sr;
        const base64wav = await this.ttsToBase64Wav(result);
        this.onResult(base64wav);
        break;
      }
      case "default-type": {
        // Implement here
        break;
      }
    }
  };
  load = async (device?: TypeDevice) => {
    const modelConfig = CONFIG[this.modelName];
    switch (modelConfig.pretrained) {
      case "Kokoro": {
        const { KokoroTTS } = await import("kokoro-js");
        this.generator = (await KokoroTTS.from_pretrained(modelConfig.name, {
          dtype: modelConfig.dtype as "q4",
          device: (device || modelConfig.device) as "webgpu",
          progress_callback: this.onProgressChange,
        })) as KokoroTTS;
        this.model = this.generator.model;
        break;
      }
      case "Outetts": {
        //@ts-expect-error No dts yer for outetts
        const { HFModelConfig_v1, InterfaceHF } = await import("outetts");
        this.onProgressChange({
          status: "progress",
          file: this.modelName,
          progress: 0,
          total: 100,
          name: this.modelName,
          loaded: 0,
        });
        const model_config = new HFModelConfig_v1({
          model_path: modelConfig.name,
          language: "en", //  en, zh, ja, ko
          dtype: modelConfig.dtype,
          device: device || modelConfig.device,
        });
        this.generator = await InterfaceHF({
          model_version: "0.2",
          cfg: model_config,
        });
        // this.generator.print_default_speakers();
        //@ts-expect-error No dts yer for outetts
        this.model = this.generator.model.model;
        break;
      }
      case "default-type": {
        this.generator = (await pipeline<"text-to-speech">(
          "text-to-speech",
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        )) as TextToAudioPipeline;
        this.model = this.generator.model;
        break;
      }
    }
  };
}

let model: TextToSpeechModel | undefined;

self.addEventListener("message", async (e) => {
  try {
    const { event, payload } = e.data;
    switch (event) {
      case "load":
        model = new TextToSpeechModel(payload.modelName);
        await model.load(payload.device);
        self.postMessage({
          event: "onLoad",
          payload: {},
        });
        break;
      case "speak":
        if (!model) {
          throw new Error("No model found");
        }
        await model.speak(payload.text, payload.voice, payload.speed);
        break;
    }
  } catch (error) {
    self.postMessage({
      event: "onError",
      payload: {
        error: (error as Error).message,
      },
    });
  }
});
