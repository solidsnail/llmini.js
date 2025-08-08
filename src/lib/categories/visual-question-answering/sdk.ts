import { ChatSDK } from "../chat";
import { EMPTY_BASE64_IMG } from "../../constants";

export default class SDK extends ChatSDK {
  /**
   * Analyze an image
   * @example
   * sdk.analyzeImage("What is the invoice number", base64Image) // "51573"
   */
  async analyzeImage(prompt: string, base64Image: string) {
    this.prompt({
      prompt,
      attachedImg: base64Image,
    });
  }

  async warmUp() {
    this.prompt({
      prompt: "",
      attachedImg: EMPTY_BASE64_IMG,
    });
  }
}
