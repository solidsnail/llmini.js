import type { ProgressInfo } from "@huggingface/transformers";
import type { TypeModelName } from "./config";
import type { TypeDevice } from "../../types";
import type { TypeMessage } from "../chat/model";
import { ChatSDK } from "../chat";

type VQACallbacks = {
  onProgressChange?: (progress: ProgressInfo) => void;
  onMessagesChange?: (messages: TypeMessage[]) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
  onReady?: () => void;
};

export default class SDK extends ChatSDK {
  constructor(
    modelName: TypeModelName,
    withWorker = true,
    device?: TypeDevice,
    callbacks: VQACallbacks = {}
  ) {
    super(modelName, {
      callbacks,
      withWorker,
      device,
    });
  }

  /**
   * Analyze an image
   * @example
   * sdk.analyzeImage("What is the invoice number", base64Image) // "51573"
   */
  async analyzeImage(prompt: string, base64Image: string) {
    this.sendMessage({
      prompt,
      attachedImg: base64Image,
    });
  }
}
