import { ObjectDetectionModel } from "./model";
import type { TypeModelName } from "./config";
import { BaseSDK } from "../../classes/base-sdk";

export default class SDK extends BaseSDK<TypeModelName, ObjectDetectionModel> {
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
      throw new Error("Model not loaded");
    }
  }

  async load() {
    return super.load("object-detection");
  }
}
