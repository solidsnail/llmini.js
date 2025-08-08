import type { TypeModelName } from "./config";
import type { TypeDevice, TypeProgress } from "../../types";
import type { TypeMessage } from "../chat/model";
import { ChatSDK } from "../chat";
import { EMPTY_BASE64_IMG } from "../../constants";

type VQACallbacks = {
  onProgressChange?: (progress: TypeProgress) => void;
  onMessagesChange?: (messages: TypeMessage[]) => void;
  onResult?: (message: TypeMessage) => void;
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

  async warmUp() {
    this.sendMessage({
      prompt: "",
      attachedImg: EMPTY_BASE64_IMG,
    });
  }
}
