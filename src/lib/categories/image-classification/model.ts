import {
  ImageProcessor,
  MobileViTFeatureExtractor,
  MobileViTForImageClassification,
  pipeline,
  ImageClassificationPipeline,
  RawImage,
  AutoImageProcessor,
  AutoModelForImageClassification,
  type ImageClassificationOutput,
} from "@huggingface/transformers";
// import { env } from "@huggingface/transformers";

import { BaseModel } from "../../classes/base-model";
import { CONFIG, type TypeModelName } from "./config";
import type { TypeDevice } from "../../types";

// env.backends.onnx.logLevel = "verbose";

export class ImageClassificationModel extends BaseModel<
  TypeModelName,
  ImageClassificationOutput,
  ImageClassificationPipeline,
  ImageProcessor
> {
  classify = async (imageBase64: string) => {
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
          )) as ImageClassificationOutput;
          this.onResult(output);
          break;
        }
        case "Auto": {
          if (!this.processor) {
            throw new Error("Processor is not loaded");
          }
          if (!this.model) {
            throw new Error("Model is not loaded");
          }
          const image = await RawImage.read(imageBase64);
          const inputs = await this.processor(image);
          const output = (await this.model(
            inputs
          )) as ImageClassificationOutput;
          this.onResult(output);
          break;
        }
        case "MobileViT": {
          if (!this.processor) {
            throw new Error("Processor is not loaded");
          }
          if (!this.model) {
            throw new Error("Model is not loaded");
          }
          const image = await RawImage.read(imageBase64);
          const inputs = await this.processor(image);
          const output = (await this.model(
            inputs
          )) as ImageClassificationOutput;
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
        this.pipeline = await pipeline<"image-classification">(
          "image-classification",
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
      case "Auto": {
        this.model = await AutoModelForImageClassification.from_pretrained(
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        );
        this.processor = await AutoImageProcessor.from_pretrained(
          modelConfig.name
        );
        break;
      }
      case "MobileViT": {
        this.model = await MobileViTForImageClassification.from_pretrained(
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        );
        this.processor = await MobileViTFeatureExtractor.from_pretrained(
          modelConfig.name
        );
        break;
      }
    }
  };
}

let model: ImageClassificationModel | undefined;

self.addEventListener("message", async (e) => {
  try {
    const { event, payload } = e.data;
    switch (event) {
      case "load":
        model = new ImageClassificationModel(payload.modelName);
        await model.load(payload.device);
        self.postMessage({
          event: "onLoad",
          payload: {},
        });
        break;
      case "classify":
        if (!model) {
          throw new Error("No model found");
        }
        await model.classify(payload.imageBase64);
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
