import {
  PreTrainedTokenizer,
  Tensor,
  UltravoxModel,
  UltravoxProcessor,
  VoxtralProcessor,
  VoxtralForConditionalGeneration,
  type PreTrainedModel,
  type ProgressInfo,
  type Message,
} from "@huggingface/transformers";
import * as wavefile from "wavefile";
// import { env } from "@huggingface/transformers";

import { BaseModel } from "../../classes/base-model";
import { CONFIG, type TypeModelName } from "./config";
import type { TypeDevice } from "../../types";

// env.backends.onnx.logLevel = "verbose";

export class AudioTextToTextModel extends BaseModel {
  private modelName: TypeModelName;
  private generator: UltravoxProcessor | undefined;
  private model: PreTrainedModel | undefined;
  private tokenizer: PreTrainedTokenizer | undefined;

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

  onResult = (result: string) => {
    self.postMessage({
      event: "onResult",
      payload: {
        result,
      },
    });
  };

  onError = (error: string) => {
    self.postMessage({
      event: "onError",
      payload: {
        error,
      },
    });
  };
  transcribe = async (audioArrayBuffer: ArrayBuffer) => {
    if (!this.model) {
      throw new Error("Model is not loaded");
    }
    if (!this.tokenizer) {
      throw new Error("Tokenizer is not loaded");
    }
    if (!this.generator) {
      throw new Error("Generator is not loaded");
    }
    try {
      const modelConfig = CONFIG[this.modelName];
      switch (modelConfig.pretrained) {
        case "Ultravox": {
          const messages = [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            { role: "user", content: "Transcribe this audio:<|audio|>" },
          ];
          const text = this.tokenizer.apply_chat_template(messages, {
            add_generation_prompt: true,
            tokenize: false,
          });
          const uint8Array = new Uint8Array(audioArrayBuffer);
          const wav = new wavefile.WaveFile(uint8Array);
          wav.toBitDepth("32f");
          wav.toSampleRate(16000);
          const audio = wav.getSamples();
          const inputs = await this.generator(text, audio);
          const generated_ids = await this.model.generate({
            ...inputs,
            max_new_tokens: 128,
          });
          const generated_texts = this.generator.batch_decode(
            (generated_ids as Tensor).slice(null, [
              inputs.input_ids.dims.at(-1),
              null,
            ]),
            { skip_special_tokens: true }
          );
          this.onResult(
            Array.from(
              generated_texts[0].match(/(["'])(?:\\\1|.)*?\1/g) || []
            )[0] || "Transcribtion failed, please try again."
          );
          break;
        }
        case "Voxtral": {
          const messages = [
            {
              role: "user",
              content: [
                { type: "audio" },
                { type: "text", text: "lang:en [TRANSCRIBE]" },
              ],
            },
          ] as unknown as Message[];
          const text = this.tokenizer.apply_chat_template(messages, {
            add_generation_prompt: true,
            tokenize: false,
          });
          const uint8Array = new Uint8Array(audioArrayBuffer);
          const wav = new wavefile.WaveFile(uint8Array);
          wav.toBitDepth("32f");
          wav.toSampleRate(16000);
          const audio = wav.getSamples();
          const inputs = await this.generator(text, audio);
          const generated_ids = await this.model.generate({
            ...inputs,
            max_new_tokens: 128,
          });
          const generated_texts = this.generator.batch_decode(
            (generated_ids as Tensor).slice(null, [
              inputs.input_ids.dims.at(-1),
              null,
            ]),
            { skip_special_tokens: true }
          );
          this.onResult(
            Array.from(
              generated_texts[0].match(/(["'])(?:\\\1|.)*?\1/g) || []
            )[0] ||
              generated_texts[0] ||
              "Transcribtion failed, please try again."
          );
          break;
        }
      }
    } catch (error) {
      this.onError((error as Error).message);
    }
  };
  load = async (device?: TypeDevice) => {
    const modelConfig = CONFIG[this.modelName];
    switch (modelConfig.pretrained) {
      case "Ultravox": {
        this.generator = await UltravoxProcessor.from_pretrained(
          modelConfig.name
        );
        this.model = await UltravoxModel.from_pretrained(modelConfig.name, {
          dtype: modelConfig.dtype,
          device: device || modelConfig.device,
          model_file_name: modelConfig.modelFileName,
          progress_callback: this.onProgressChange,
          subfolder: modelConfig.subfolder,
        });
        this.tokenizer = this.generator.tokenizer;
        break;
      }
      case "Voxtral": {
        this.generator = await VoxtralProcessor.from_pretrained(
          modelConfig.name
        );
        this.model = await VoxtralForConditionalGeneration.from_pretrained(
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        );
        this.tokenizer = this.generator.tokenizer;
        break;
      }
    }
  };
}

let model: AudioTextToTextModel | undefined;

self.addEventListener("message", async (e) => {
  try {
    const { event, payload } = e.data;
    switch (event) {
      case "load":
        model = new AudioTextToTextModel(payload.modelName);
        await model.load(payload.device);
        self.postMessage({
          event: "onLoad",
          payload: {},
        });
        break;
      case "transcribe":
        if (!model) {
          throw new Error("No model found");
        }
        await model.transcribe(payload.audioArrayBuffer);
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
