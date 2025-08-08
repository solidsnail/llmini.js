import { AudioTextToTextModel } from "./model";
import type { TypeDevice, TypeProgress } from "../../types";
import type { TypeModelName } from "./config";
import { BaseSDK } from "../../classes/base-sdk";

type Callbacks = {
  onProgressChange?: (info: TypeProgress) => void;
  onResult?: (result: string) => void;
  onError?: (error: string) => void;
};

export default class SDK extends BaseSDK<TypeModelName, AudioTextToTextModel> {
  constructor(
    modelName: TypeModelName,
    withWorker = true,
    device?: TypeDevice,
    callbacks: Callbacks = {}
  ) {
    super(modelName, withWorker, device, callbacks);
  }

  /**
   * Transcribe audio
   * @param audioArrayBuffer ArrayBuffer of the audio
   * @example
   * sdk.transcribe(audioArrayBuffer);
   */
  async transcribe(audioArrayBuffer: ArrayBuffer) {
    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "transcribe",
        payload: { audioArrayBuffer },
      });
    } else if (this.model) {
      await this.model.transcribe(audioArrayBuffer);
    } else {
      throw new Error("Model not loaded");
    }
  }

  async load() {
    return super.load("audio-text-to-text");
  }
}
