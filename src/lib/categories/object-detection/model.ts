import {
  PreTrainedTokenizer,
  ImageProcessor,
  type PreTrainedModel,
  type ProgressInfo,
  pipeline,
  ObjectDetectionPipeline,
  RawImage,
  type ObjectDetectionPipelineOutput,
} from "@huggingface/transformers";
// import { env } from "@huggingface/transformers";

import { BaseModel } from "../../classes/base-model";
import { CONFIG, type TypeModelName } from "./config";
import type { TypeDevice } from "../../types";

// env.backends.onnx.logLevel = "verbose";

export class ObjectDetectionModel extends BaseModel {
  private modelName: TypeModelName;
  private processor: ImageProcessor | undefined;
  private model: PreTrainedModel | undefined;
  private generator: ObjectDetectionPipeline | undefined;
  private tokenizer: PreTrainedTokenizer | undefined;
  private isLoaded = false;

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

  onResult = (result: ObjectDetectionPipelineOutput) => {
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

  detect = async (imageBase64: string) => {
    try {
      const modelConfig = CONFIG[this.modelName];
      switch (modelConfig.pretrained) {
        case "pipeline": {
          if (!this.generator) {
            throw new Error("Generator is not loaded");
          }
          const image = await RawImage.read(imageBase64);
          const output = (await this.generator(
            image
          )) as ObjectDetectionPipelineOutput;
          console.log({ output });
          this.onResult(output);
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
      case "pipeline": {
        this.generator = await pipeline<"object-detection">(
          "object-detection",
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        );
        this.isLoaded = true;
        break;
      }
    }
  };
}

let model: ObjectDetectionModel | undefined;

self.addEventListener("message", async (e) => {
  try {
    const { event, payload } = e.data;
    switch (event) {
      case "load":
        model = new ObjectDetectionModel(payload.modelName);
        await model.load(payload.device);
        self.postMessage({
          event: "onLoad",
          payload: {},
        });
        break;
      case "detect":
        if (!model) {
          throw new Error("No model found");
        }
        await model.detect(payload.imageBase64);
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
