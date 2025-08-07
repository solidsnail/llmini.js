import type { ProgressInfo } from "@huggingface/transformers";
import type { TypeDevice } from "../../types";
import type { TypeModelName } from "./config";
import { ChatModel, type TypeMessage } from "./model";

type ChatSettings = {
  maxTokens?: number;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  characterTimeout?: number;
};

type ChatCallbacks = {
  onProgressChange?: (info: ProgressInfo) => void;
  onMessagesChange?: (messages: TypeMessage[]) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
  onReady?: (isSystemRoleSupported: boolean) => void;
};

export default class SDK {
  private modelName: TypeModelName;
  private device?: TypeDevice;
  private withWorker: boolean;
  private system: string;
  private defaultMessages: TypeMessage[];
  private worker?: Worker;
  private model?: ChatModel;
  private isSystemRoleSupported = false;
  private callbacks: ChatCallbacks;

  constructor(
    modelName: TypeModelName,
    {
      device,
      withWorker = true,
      system = "",
      defaultMessages = [],
      callbacks = {},
    }: {
      device?: TypeDevice;
      withWorker?: boolean;
      system?: string;
      defaultMessages?: TypeMessage[];
      callbacks?: ChatCallbacks;
    }
  ) {
    this.modelName = modelName;
    this.device = device;
    this.withWorker = withWorker;
    this.system = system;
    this.defaultMessages = defaultMessages;
    this.callbacks = callbacks;
  }

  private getInitialMessages(): TypeMessage[] {
    const messages: TypeMessage[] = [];
    if (this.system && this.isSystemRoleSupported) {
      messages.push({ role: "system", content: this.system });
    }
    messages.push(...this.defaultMessages);
    return messages;
  }

  async load() {
    if (this.withWorker) {
      this.worker = new Worker(new URL("./model.js", import.meta.url), {
        type: "module",
      });

      this.worker.addEventListener("message", (e: MessageEvent) => {
        const { event, payload } = e.data;
        switch (event) {
          case "onProgressChange":
            this.callbacks.onProgressChange?.(payload.progress);
            break;
          case "onMessagesChange":
            this.callbacks.onMessagesChange?.(payload.messages);
            break;
          case "onLoad":
            this.isSystemRoleSupported = payload.isSystemRoleSupported;
            this.callbacks.onReady?.(this.isSystemRoleSupported);
            this.callbacks.onProgressChange?.({
              status: "ready",
              model: this.modelName,
              task: "",
            });
            this.resetMessages();
            break;
          case "onDone":
            this.callbacks.onDone?.();
            break;
          case "onError":
            this.callbacks.onError?.(payload.error);
            break;
        }
      });

      this.worker.addEventListener("error", (e: ErrorEvent) => {
        console.error("Worker error", e);
        this.callbacks.onError?.(e.message);
      });

      this.worker.postMessage({
        event: "load",
        payload: {
          modelName: this.modelName,
          device: this.device,
        },
      });
    } else {
      try {
        this.model = new ChatModel(this.modelName);
        if (this.callbacks.onProgressChange) {
          this.model.onProgressChange = this.callbacks.onProgressChange;
        }
        if (this.callbacks.onMessagesChange) {
          this.model.onMessagesChange = this.callbacks.onMessagesChange;
        }
        if (this.callbacks.onDone) {
          this.model.onDone = this.callbacks.onDone;
        }
        await this.model.load(this.device);
        this.isSystemRoleSupported = this.model.isSystemRoleSupported();
        this.callbacks.onReady?.(this.isSystemRoleSupported);
        this.callbacks.onProgressChange?.({
          status: "ready",
          model: this.modelName,
          task: "",
        });
        this.resetMessages();
      } catch (error) {
        this.callbacks.onError?.((error as Error).message);
      }
    }
  }

  /**
   * Reset messages
   */
  resetMessages() {
    const messages = this.getInitialMessages();
    if (this.worker) {
      this.worker.postMessage({
        event: "setMessages",
        payload: { messages },
      });
    } else if (this.model) {
      this.model.setMessages(messages);
    }
  }

  /**
   * Send message 
   * @example
   * sdk.sendMessage({
        prompt: "Why is the sky blue ?",
        settings: { maxTokens: 100 },
      });
    * @example
    * sdk.sendMessage({
          prompt: "Describe this image",
          settings: { attachedImg: base64Image, },
        });
    * @example
    * sdk.sendMessage({
      prompt: "A cute and adorable baby fox with big brown eyes, autumn leaves in the background enchanting,immortal,fluffy, shiny mane,Petals,fairyism,unreal engine 5 and Octane Render,highly detailed, photorealistic, cinematic, natural colors.",
      settings: { isImageGen: true, },
      });
   */
  async sendMessage({
    prompt,
    settings = {},
    attachedImg,
    isImageGen,
  }: {
    prompt: string;
    settings?: ChatSettings;
    attachedImg?: string;
    isImageGen?: boolean;
  }) {
    const chatTemplate = isImageGen ? "text_to_image" : undefined;
    const content = attachedImg ? `<image_placeholder>\n${prompt}` : prompt;

    const messagePayload: TypeMessage = {
      role: "user",
      content,
      ...(attachedImg ? { images: [attachedImg] } : {}),
    };

    if (this.withWorker && this.worker) {
      this.worker.postMessage({
        event: "addMessage",
        payload: messagePayload,
      });
      this.worker.postMessage({
        event: "prompt",
        payload: { ...settings, chat_template: chatTemplate },
      });
    } else if (this.model) {
      // this.resetMessages();
      this.model.addMessage(messagePayload);
      await this.model.prompt({ ...settings, chat_template: chatTemplate });
    } else {
      throw new Error("Chat model not loaded");
    }
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
    this.model = undefined;
  }
}
