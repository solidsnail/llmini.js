import { ImageTextToTextModel } from "./model";
import type { TypeDevice, TypeProgress } from "../../types";
import type { TypeModelName } from "./config";
import { EMPTY_BASE64_IMG } from "../../constants";

type Callbacks = {
  onProgressChange?: (info: TypeProgress) => void;
  onResult?: (result: string) => void;
  onError?: (error: string) => void;
  onDone?: () => void;
};

export default class SDK {
  private withWorker: boolean;
  private modelName: TypeModelName;
  private device?: TypeDevice;
  private model?: ImageTextToTextModel;
  private worker?: Worker;
  private callbacks: Callbacks;

  constructor(
    modelName: TypeModelName,
    withWorker = true,
    device?: TypeDevice,
    callbacks: Callbacks = {}
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
              break;
            case "onLoad":
              this.callbacks.onProgressChange?.({
                status: "ready",
                model: this.modelName,
                task: "",
              });
              resolve(undefined);
              break;
            case "onError":
              this.callbacks.onError?.(payload.error);
              break;
            case "onDone":
              this.callbacks.onDone?.();
              break;
          }
        });

        this.worker.postMessage({
          event: "load",
          payload: { modelName: this.modelName },
        });
      });
    } else {
      this.model = new ImageTextToTextModel(this.modelName);
      if (this.callbacks.onProgressChange) {
        this.model.onProgressChange = this.callbacks.onProgressChange;
      }
      if (this.callbacks.onResult) {
        this.model.onResult = this.callbacks.onResult;
      }
      await this.model.load(this.device);
      this.callbacks.onProgressChange?.({
        status: "ready",
        model: this.modelName,
        task: "",
      });
    }
  }

  /**
   * Get informations about an image
   * @example
   * sdk.ask(imageBase64, "Give me a description") // "A sleeping cat";
   */
  async ask(question: string, imageBase64: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "ask",
        payload: { question, imageBase64 },
      });
    } else if (this.model) {
      await this.model.ask(question, imageBase64);
    } else {
      throw new Error("SDK not loaded");
    }
  }

  async warmUp() {
    this.ask("", EMPTY_BASE64_IMG);
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
    this.model = undefined;
  }
}
