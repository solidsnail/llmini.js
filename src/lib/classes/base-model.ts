import { RawImage } from "@huggingface/transformers";

declare global {
  interface Navigator {
    gpu: {
      requestAdapter: () => Promise<unknown>;
    };
  }
}

export class BaseModel {
  async checkWebGpuSupport() {
    if (!navigator.gpu) {
      throw new Error(
        "No gpu adapter found, currently only Chrome and Edge support Webgpu:\n\n https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API"
      );
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("WebGPU is not supported");
    }
  }

  async rawImageToBase64(rawImage: RawImage): Promise<string> {
    const blob = await rawImage.toBlob("image/png", 1.0);
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    // dataUrl is like "data:image/png;base64,..."
    const base64 = "data:image/png;base64," + dataUrl.split(",")[1];
    return base64;
  }
}
