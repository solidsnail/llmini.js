import { CATEGORIES_MODELS } from "../categories";
import type { ChatModel, TypeMessage } from "../categories/chat/model";
import type { TypeDevice, TypeModel, TypeProgress } from "../types";

type Callbacks = {
  onProgressChange?: (info: TypeProgress) => void;
  onMessagesChange?: (messages: TypeMessage[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResult?: (result: any) => void;
  onError?: (error: string) => void;
};

export class BaseSDK<MODELNAME extends string, MODEL extends TypeModel> {
  withWorker: boolean;
  private modelName: MODELNAME;
  private device?: TypeDevice;
  worker?: Worker;
  private callbacks: Callbacks;
  model?: MODEL;

  constructor(
    modelName: MODELNAME,
    withWorker = true,
    device?: TypeDevice,
    callbacks: Callbacks = {}
  ) {
    this.modelName = modelName;
    this.withWorker = withWorker;
    this.device = device;
    this.callbacks = callbacks;
  }

  // Define a const object that holds categories and their respective model class, pass key , ModelClass
  async load(modelCategory: keyof typeof CATEGORIES_MODELS) {
    if (this.withWorker) {
      return new Promise((resolve) => {
        let workerUrl = "";
        switch (modelCategory) {
          case "audio-text-to-text":
            workerUrl = "../categories/audio-text-to-text/model.js";
            break;
          case "chat":
            workerUrl = "../categories/chat/model.js";
            break;
          case "depth-estimation":
            workerUrl = "../categories/depth-estimation/model.js";
            break;
          case "document-question-answering":
            workerUrl = "../categories/document-question-answering/model.js";
            break;
          case "image-classification":
            workerUrl = "../categories/image-classification/model.js";
            break;
          case "image-text-to-text":
            workerUrl = "../categories/image-text-to-text/model.js";
            break;
          case "object-detection":
            workerUrl = "../categories/object-detection/model.js";
            break;
          case "text-to-speech":
            workerUrl = "../categories/text-to-speech/model.js";
            break;
          case "visual-question-answering":
            workerUrl = "../categories/visual-question-answering/model.js";
            break;
        }
        this.worker = new Worker(new URL(workerUrl, import.meta.url), {
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
            case "onMessagesChange":
              this.callbacks.onMessagesChange?.(payload.messages);
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
          }
        });

        this.worker.postMessage({
          event: "load",
          payload: { modelName: this.modelName },
        });
      });
    } else {
      const ModelClass = CATEGORIES_MODELS[modelCategory];
      this.model = new ModelClass(this.modelName) as MODEL;
      if (this.callbacks.onProgressChange) {
        this.model.onProgressChange = this.callbacks.onProgressChange;
      }
      if (this.callbacks.onMessagesChange) {
        (this.model as ChatModel).onMessagesChange =
          this.callbacks.onMessagesChange;
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

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
    this.model = undefined;
  }
}
