import type { ProgressInfo } from "@huggingface/transformers";
import { ImageTextToTextModel } from "./model";
import type { TypeDevice } from "../../types";
import type { TypeModelName } from "./config";

type Callbacks = {
  onProgressChange?: (info: ProgressInfo) => void;
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
  async ask(imageBase64: string, question: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "ask",
        payload: { imageBase64, question },
      });
    } else if (this.model) {
      await this.model.ask(imageBase64, question);
    } else {
      throw new Error("SDK not loaded");
    }
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
    this.model = undefined;
  }
}
