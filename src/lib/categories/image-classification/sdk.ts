import { ImageClassificationModel } from "./model";
import type { TypeModelName } from "./config";
import { BaseSDK } from "../../classes/base-sdk";

export default class SDK extends BaseSDK<
  TypeModelName,
  ImageClassificationModel
> {
  /**
   * Classify an image
   * @example
   * sdk.classify(imageBase64) // [{ label: "cat", score: 0.9 }];
   */
  async classify(imageBase64: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "classify",
        payload: { imageBase64 },
      });
    } else if (this.model) {
      await this.model.classify(imageBase64);
    } else {
      throw new Error("SDK not loaded");
    }
  }

  async load() {
    return super.load("image-classification");
  }
}
