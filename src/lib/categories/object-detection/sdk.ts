import type { ObjectDetectionPipelineOutput } from "@huggingface/transformers";
import { ObjectDetectionModel } from "./model";
import type { TypeDevice, TypeProgress } from "../../types";
import type { TypeModelName } from "./config";

type Callbacks = {
  onProgressChange?: (info: TypeProgress) => void;
  onResult?: (result: ObjectDetectionPipelineOutput) => void;
  onError?: (error: string) => void;
  onDone?: () => void;
};

export default class SDK {
  private withWorker: boolean;
  private modelName: TypeModelName;
  private device?: TypeDevice;
  private model?: ObjectDetectionModel;
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
      this.model = new ObjectDetectionModel(this.modelName);
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
   * Detect objects in an image
   * @example
   * sdk.detect(imageBase64)
   */
  async detect(imageBase64: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "detect",
        payload: { imageBase64 },
      });
    } else if (this.model) {
      await this.model.detect(imageBase64);
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
