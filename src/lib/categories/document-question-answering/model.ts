import {
  pipeline,
  DocumentQuestionAnsweringPipeline,
  type DocumentQuestionAnsweringOutput,
  type ProgressInfo,
} from "@huggingface/transformers";
// import { env } from "@huggingface/transformers";

import { BaseModel } from "../../classes/base-model";
import { CONFIG, type TypeModelName } from "./config";
import type { TypeDevice } from "../../types";

// env.backends.onnx.logLevel = "verbose";

export class DocumentQuestionAnsweringModel extends BaseModel {
  private modelName: TypeModelName;
  private generator: DocumentQuestionAnsweringPipeline | undefined;

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
  ask = async (image: string, question: string) => {
    if (!this.generator) {
      throw new Error("Generator is not loaded");
    }
    const modelConfig = CONFIG[this.modelName];
    switch (modelConfig.pretrained) {
      case "default-type": {
        const output = await this.generator(image, question);
        const [{ answer }] = output as DocumentQuestionAnsweringOutput;
        this.onResult(answer);
        break;
      }
    }
  };
  load = async (device?: TypeDevice) => {
    const modelConfig = CONFIG[this.modelName];
    switch (modelConfig.pretrained) {
      case "default-type": {
        this.generator = (await pipeline<"document-question-answering">(
          "document-question-answering",
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        )) as DocumentQuestionAnsweringPipeline;
        break;
      }
    }
  };
}

let model: DocumentQuestionAnsweringModel | undefined;

self.addEventListener("message", async (e) => {
  try {
    const { event, payload } = e.data;
    switch (event) {
      case "load":
        model = new DocumentQuestionAnsweringModel(payload.modelName);
        await model.load(payload.device);
        self.postMessage({
          event: "onLoad",
          payload: {},
        });
        break;
      case "ask":
        if (!model) {
          throw new Error("No model found");
        }
        await model.ask(payload.image, payload.question);
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
