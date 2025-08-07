import type { ProgressInfo } from "@huggingface/transformers";
import type { TypeModelName } from "./config";
import type { TypeDevice } from "../../types";
import { DocumentQuestionAnsweringModel } from "./model";

type VQACallbacks = {
  onProgressChange?: (progress: ProgressInfo) => void;
  onResult?: (result: string) => void;
  onError?: (error: string) => void;
  onReady?: () => void;
};

export default class SDK {
  private modelName: TypeModelName;
  private device?: TypeDevice;
  private withWorker: boolean;
  private worker?: Worker;
  private model?: DocumentQuestionAnsweringModel;
  private callbacks: VQACallbacks;

  constructor(
    modelName: TypeModelName,
    withWorker = true,
    device?: TypeDevice,
    callbacks: VQACallbacks = {}
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
            this.callbacks.onReady?.();
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
        payload: { modelName: this.modelName, device: this.device },
      });
    } else {
      try {
        this.model = new DocumentQuestionAnsweringModel(this.modelName);
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
        this.callbacks.onReady?.();
      } catch (error) {
        this.callbacks.onError?.((error as Error).message);
      }
    }
  }

  /**
   * Ask a question about an image
   * @example
   * sdk.ask("What is this animal ?", imageBase64);
   */
  async ask(question: string, image: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "ask",
        payload: {
          question,
          image,
        },
      });
    } else if (this.model) {
      await this.model.ask(image, question);
    } else {
      throw new Error("Model not loaded");
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
