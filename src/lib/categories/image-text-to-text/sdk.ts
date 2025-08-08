import { ImageTextToTextModel } from "./model";
import type { TypeModelName } from "./config";
import { EMPTY_BASE64_IMG } from "../../constants";
import { BaseSDK } from "../../classes/base-sdk";

export default class SDK extends BaseSDK<TypeModelName, ImageTextToTextModel> {
  /**
   * Get informations about an image
   * @example
   * sdk.ask(imageBase64, "Give me a description") // "A sleeping cat";
   */
  async ask(question: string, imageBase64: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "ask",
        payload: { question, imageBase64 },
      });
    } else if (this.model) {
      await this.model.ask(question, imageBase64);
    } else {
      throw new Error("Model not loaded");
    }
  }

  async warmUp() {
    this.ask("", EMPTY_BASE64_IMG);
  }

  async load() {
    return super.load("image-text-to-text");
  }
}
