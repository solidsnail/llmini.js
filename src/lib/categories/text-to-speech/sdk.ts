import { TextToSpeechModel } from "./model";
import type {
  TypeKokoroVoice,
  TypeOutettsVoice,
  TypeModelName,
} from "./config";
import type { TypeDevice, TypeProgress } from "../../types";

type TypeVoice = TypeKokoroVoice | TypeOutettsVoice;

type TTSCallbacks = {
  onProgressChange?: (info: TypeProgress) => void;
  onResult?: (audioBase64: string) => void;
  onError?: (error: string) => void;
  onDone?: () => void;
  onReady?: () => void;
};

export default class SDK {
  private withWorker: boolean;
  private modelName: TypeModelName;
  private device?: TypeDevice;
  private model?: TextToSpeechModel;
  private worker?: Worker;
  private callbacks: TTSCallbacks;

  constructor(
    modelName: TypeModelName,
    withWorker = true,
    device?: TypeDevice,
    callbacks: TTSCallbacks = {}
  ) {
    this.modelName = modelName;
    this.withWorker = withWorker;
    this.device = device;
    this.callbacks = callbacks;
  }

  async load() {
    if (this.withWorker) {
      return new Promise((resolve) => {
        this.worker = new Worker(new URL("./model.js", import.meta.url), {
          type: "module",
        });

        this.worker.addEventListener("message", (e: MessageEvent) => {
          const { event, payload } = e.data;
          switch (event) {
            case "onProgressChange":
              this.callbacks.onProgressChange?.(payload.progress);
              break;
            case "onResult":
              this.callbacks.onResult?.(payload.result);
              this.callbacks.onDone?.();
              break;
            case "onLoad":
              this.callbacks.onProgressChange?.({
                status: "ready",
                model: this.modelName,
                task: "",
              });
              this.callbacks.onReady?.();
              resolve(undefined);
              break;
            case "onDone":
              this.callbacks.onDone?.();
              break;
            case "onError":
              this.callbacks.onError?.(payload.error);
              break;
          }
        });

        this.worker.addEventListener("error", (e: ErrorEvent) => {
          console.error("Worker error", e);
          this.callbacks.onError?.(e.message);
        });

        this.worker.postMessage({
          event: "load",
          payload: { modelName: this.modelName },
        });
      });
    } else {
      try {
        this.model = new TextToSpeechModel(this.modelName);
        if (this.callbacks.onProgressChange) {
          this.model.onProgressChange = this.callbacks.onProgressChange;
        }
        this.model.onResult = (audioBase64: string) => {
          this.callbacks.onResult?.(audioBase64);
          this.callbacks.onDone?.();
        };
        await this.model.load(this.device);
        this.callbacks.onProgressChange?.({
          status: "ready",
          model: this.modelName,
          task: "",
        });
        this.callbacks.onReady?.();
      } catch (error) {
        this.callbacks.onError?.((error as Error).message);
      }
    }
  }

  /**
   * Generate audio from text
   * @example
   * sdk.speak("Hello world", "af_alloy", 1.3)   // Kokoro model
   * @example
   * sdk.speak("Hello world", "male_1", 1.3)   // Outetts model
   */
  async speak(text: string, voice: TypeVoice, speed = 1) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "speak",
        payload: { text, voice, speed },
      });
    } else if (this.model) {
      await this.model.speak(text, voice, speed);
    } else {
      throw new Error("SDK not loaded");
    }
  }

  async warmUp() {
    this.speak("", "af_alloy", 1.3);
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
    this.model = undefined;
  }
}
