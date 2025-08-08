import type { TypeModelName } from "./config";
import { DocumentQuestionAnsweringModel } from "./model";
import { BaseSDK } from "../../classes/base-sdk";

export default class SDK extends BaseSDK<
  TypeModelName,
  DocumentQuestionAnsweringModel
> {
  /**
   * Ask a question about an image
   * @example
   * sdk.ask("What is this animal ?", imageBase64);
   */
  async ask(question: string, image: string) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "ask",
        payload: {
          question,
          image,
        },
      });
    } else if (this.model) {
      await this.model.ask(image, question);
    } else {
      throw new Error("Model not loaded");
    }
  }

  async load() {
    return super.load("document-question-answering");
  }
}
