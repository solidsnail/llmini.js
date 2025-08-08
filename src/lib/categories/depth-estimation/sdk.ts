import { DepthEstimationModel } from "./model";
import { BaseSDK } from "../../classes/base-sdk";
import type { TypeModelName } from "./config";

export default class SDK extends BaseSDK<TypeModelName, DepthEstimationModel> {
  /**
   * Generate image depth estimation image
   * @example
   * sdk.estimate(imageBase64);
   */
  async estimate(imageBase64: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "estimate",
        payload: { imageBase64 },
      });
    } else if (this.model) {
      await this.model.estimate(imageBase64);
    } else {
      throw new Error("Model not loaded");
    }
  }

  async load() {
    return super.load("depth-estimation");
  }
}
