import {
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

export class ObjectDetectionModel extends BaseModel<
  TypeModelName,
  ObjectDetectionPipelineOutput,
  ObjectDetectionPipeline
> {
  detect = async (imageBase64: string) => {
    try {
      const modelConfig = CONFIG[this.modelName];
      switch (modelConfig.pretrained) {
        case "pipeline": {
          if (!this.pipeline) {
            throw new Error("Generator is not loaded");
          }
          const image = await RawImage.read(imageBase64);
          const output = (await this.pipeline(
            image
          )) as ObjectDetectionPipelineOutput;
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
        this.pipeline = await pipeline<"object-detection">(
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
