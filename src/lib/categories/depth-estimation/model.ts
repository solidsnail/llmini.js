import {
  AutoModelForDepthEstimation,
  AutoProcessor,
  RawImage,
  type DepthEstimationPipelineOutput,
  pipeline,
  DepthEstimationPipeline,
} from "@huggingface/transformers";
// import { env } from "@huggingface/transformers";

import { BaseModel } from "../../classes/base-model";
import { CONFIG, type TypeModelName } from "./config";
import type { TypeDevice } from "../../types";

// env.backends.onnx.logLevel = "verbose";

export class DepthEstimationModel extends BaseModel<
  TypeModelName,
  string,
  DepthEstimationPipeline
> {
  estimate = async (imageBase64: string) => {
    try {
      const modelConfig = CONFIG[this.modelName];
      switch (modelConfig.pretrained) {
        case "pipeline": {
          if (!this.pipeline) {
            throw new Error("Generator is not loaded");
          }
          const output = (await this.pipeline(
            imageBase64
          )) as DepthEstimationPipelineOutput;
          if (output.depth) {
            const base64Depth = await this.rawImageToBase64(output.depth);
            this.onResult(base64Depth);
          }
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
          const { predicted_depth } = await this.model(inputs);

          // Normalize the depth map to [0, 1]
          const depth_map_data = predicted_depth.data;
          let minDepth = Infinity;
          let maxDepth = -Infinity;
          for (let i = 0; i < depth_map_data.length; ++i) {
            minDepth = Math.min(minDepth, depth_map_data[i]);
            maxDepth = Math.max(maxDepth, depth_map_data[i]);
          }
          const depth_tensor = predicted_depth
            .sub_(minDepth)
            .div_(-(maxDepth - minDepth)) // Flip for visualization purposes
            .add_(1)
            .clamp_(0, 1)
            .mul_(255)
            .round_()
            .to("uint8");

          // Save the depth map
          const depth_image = RawImage.fromTensor(depth_tensor);
          const base64Depth = await this.rawImageToBase64(depth_image);
          this.onResult(base64Depth);
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
        this.pipeline = await pipeline<"depth-estimation">(
          "depth-estimation",
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
        this.model = await AutoModelForDepthEstimation.from_pretrained(
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        );
        this.processor = await AutoProcessor.from_pretrained(modelConfig.name);
        break;
      }
    }
  };
}

let model: DepthEstimationModel | undefined;

self.addEventListener("message", async (e) => {
  try {
    const { event, payload } = e.data;
    switch (event) {
      case "load":
        model = new DepthEstimationModel(payload.modelName);
        await model.load(payload.device);
        self.postMessage({
          event: "onLoad",
          payload: {},
        });
        break;
      case "estimate":
        if (!model) {
          throw new Error("No model found");
        }
        await model.estimate(payload.imageBase64);
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
