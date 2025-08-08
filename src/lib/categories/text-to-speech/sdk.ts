import { TextToSpeechModel } from "./model";
import type {
  TypeKokoroVoice,
  TypeOutettsVoice,
  TypeModelName,
} from "./config";
import { BaseSDK } from "../../classes/base-sdk";

type TypeVoice = TypeKokoroVoice | TypeOutettsVoice;

export default class SDK extends BaseSDK<TypeModelName, TextToSpeechModel> {
  /**
   * Generate audio from text
   * @example
   * sdk.speak("Hello world", "af_alloy", 1.3)   // Kokoro model
   * @example
   * sdk.speak("Hello world", "male_1", 1.3)   // Outetts model
   */
  async speak(text: string, voice: TypeVoice, speed = 1) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "speak",
        payload: { text, voice, speed },
      });
    } else if (this.model) {
      await this.model.speak(text, voice, speed);
    } else {
      throw new Error("SDK not loaded");
    }
  }

  async warmUp() {
    this.speak("", "af_alloy", 1.3);
  }

  async load() {
    return super.load("text-to-speech");
  }
}
