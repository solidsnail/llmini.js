import {
  pipeline,
  TextGenerationPipeline,
  TextStreamer,
  AutoProcessor,
  MultiModalityCausalLM,
  InterruptableStoppingCriteria,
  Tensor,
  type VLChatProcessor,
  type Chat,
  type Message,
  type TextGenerationSingle,
} from "@huggingface/transformers";

// import { env } from "@huggingface/transformers";

import { BaseModel } from "../../classes/base-model";
import { CONFIG, type TypeModelName } from "./config";
import { ProgressStreamer } from "../../classes/progress-streamer";
import type { TypeDevice } from "../../types";

// env.backends.onnx.logLevel = "verbose";

export type TypeMessage = Omit<Message, "role"> & {
  role: "user" | "assistant" | "system" | "image";
  images?: string[];
};

type TypePromptProgressCallback = (args: { chunk: string }) => void;
export class ChatModel extends BaseModel<
  TypeModelName,
  TypeMessage,
  TextGenerationPipeline
> {
  private _messages: TypeMessage[] = [];
  private isLoaded = false;
  private characterQueue: string[] = [];
  private isProcessingQueue = false;

  get messages() {
    return this._messages;
  }

  private truncateImages(messages: TypeMessage[]) {
    return messages.map((message) => {
      if (message.role === "image") {
        return {
          ...message,
          content:
            "![Generated image](data:image/png;base64,iVBORw0KGgoAAAANSUhEU)",
        };
      }
      return message;
    });
  }

  setMessages = (messages: TypeMessage[]) => {
    this._messages = messages;
    this.onMessagesChange(this._messages);
  };

  addMessage = (message: TypeMessage) => {
    this._messages.push(message);
    this.onMessagesChange(this._messages);
  };

  setMessage = (index: number, message: TypeMessage) => {
    this._messages[index] = message;
    this.onMessagesChange(this._messages);
  };

  removeMessage = (index: number) => {
    this._messages.splice(index, 1);

    this.onMessagesChange(this._messages);
  };

  getMessage = (index: number) => {
    return this._messages[index];
  };

  onMessagesChange = (messages: typeof this._messages) => {
    self.postMessage({
      event: "onMessagesChange",
      payload: {
        messages,
      },
    });
  };

  isSystemRoleSupported = () => {
    return true;
  };

  private async processCharacterQueue(messageIndex: number, timeout: number) {
    this.isProcessingQueue = true;

    while (this.characterQueue.length > 0) {
      const character = this.characterQueue.shift()!;
      let content = this.getMessage(messageIndex).content;
      content += character;

      this.setMessage(messageIndex, {
        role: "assistant",
        content,
      });

      await new Promise((resolve) => setTimeout(resolve, timeout));
    }

    this.isProcessingQueue = false;
  }

  prompt = async (promptArgs: {
    maxTokens?: number;
    progressCallback?: TypePromptProgressCallback;
    chat_template?: "text_to_image" | undefined;
    characterTimeout?: number;
    do_sample?: boolean;
    temperature?: number;
    top_k?: number;
    top_p?: number;
  }) => {
    if (!this.isLoaded) throw new Error("Model not loaded");
    if (!this.tokenizer) throw new Error("No tokenizer");
    const defaultArgs = {
      maxTokens: 512 * 2,
      do_sample: false,
      temperature: 1,
      top_k: 50,
      top_p: 1,
    };
    const args = {
      ...defaultArgs,
      ...(promptArgs || {}),
    };
    const placeholderIndex = this._messages.length;
    this.addMessage({ role: "assistant", content: "" });
    // Reset character queue for new prompt
    this.characterQueue = [];
    this.isProcessingQueue = false;

    const streamer = new TextStreamer(this.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: async (chunk) => {
        if (args.progressCallback) args.progressCallback({ chunk });
        if (typeof args.characterTimeout === "undefined") {
          // Original fast path - no character timeout
          let content = this.getMessage(placeholderIndex).content;
          content += chunk;
          this.setMessage(placeholderIndex, {
            role: "assistant",
            content,
          });
        } else {
          // Queue characters for timed display
          const characters = chunk.split("");
          this.characterQueue.push(...characters);

          // Start processing queue if not already running
          if (!this.isProcessingQueue) {
            this.processCharacterQueue(placeholderIndex, args.characterTimeout);
          }
        }
      },
    });
    switch (CONFIG[this.modelName].pretrained) {
      case "MultiModalityCausalLM": {
        if (!this.model?.generate || !this.processor) {
          throw new Error("No model");
        }
        const model = this.model as unknown as MultiModalityCausalLM;
        const processor = this.processor as unknown as VLChatProcessor;
        if (args.chat_template === "text_to_image") {
          const num_image_tokens = processor.num_image_tokens;
          const inputs = await processor(this.truncateImages(this._messages), {
            chat_template: args.chat_template,
          });
          const streamer = new ProgressStreamer(num_image_tokens, (chunk) => {
            this.setMessage(this._messages.length - 1, {
              role: "assistant",
              content: `Generating image... ${chunk.progress}%`,
            });
          });
          const imageOutputs = await model.generate_images({
            ...inputs,
            min_new_tokens: num_image_tokens,
            max_new_tokens: num_image_tokens,
            do_sample: args.do_sample,
            streamer,
          });
          const imageBase64 = await this.rawImageToBase64(imageOutputs[0]);
          this.setMessage(this._messages.length - 1, {
            role: "image",
            content: `![${
              this._messages[this._messages.length - 1].content
            }](${imageBase64})`,
          });
        } else {
          const inputs = await processor(this._messages);
          const outputs = (await model.generate({
            ...inputs,
            max_new_tokens: args.maxTokens,
            do_sample: args.do_sample,
            streamer,
            stopping_criteria: new InterruptableStoppingCriteria(),
          })) as Tensor;
          if (!outputs) throw new Error("No outputs");
          const new_tokens = outputs.slice(null, [
            inputs.input_ids.dims.at(-1),
            null,
          ]);
          const [content] = processor.batch_decode(new_tokens, {
            skip_special_tokens: true,
          });
          const lastReply: TypeMessage = {
            role: "assistant",
            content,
          };
          this.setMessage(placeholderIndex, lastReply);
          this.onResult(lastReply);
        }

        break;
      }
      case "default-type": {
        if (this.pipeline) {
          // this.pipeline.tokenizer.apply_chat_template(this._messages, {
          //   tokenize: false,
          //   add_generation_prompt: true,
          // });
          const outputs = await this.pipeline(this._messages, {
            max_new_tokens: args.maxTokens,
            // return_full_text: false,
            do_sample: args.do_sample,
            streamer,
            temperature: args.temperature,
            top_k: args.top_k,
            top_p: args.top_p,
          });
          if (!outputs) throw new Error("No outputs");
          const chat = (outputs[0] as TextGenerationSingle)
            .generated_text as Chat;
          const lastReply = (chat as TypeMessage[]).pop()!;
          this.setMessage(placeholderIndex, lastReply);
          this.onResult(lastReply);
        } else {
          throw new Error("No generator");
        }
        break;
      }
    }
  };

  load = async (device?: TypeDevice) => {
    const modelConfig = CONFIG[this.modelName];
    switch (modelConfig.pretrained) {
      case "MultiModalityCausalLM": {
        this.processor = await AutoProcessor.from_pretrained(modelConfig.name, {
          progress_callback: this.onProgressChange,
        });

        this.model = await MultiModalityCausalLM.from_pretrained(
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || {
              prepare_inputs_embeds: "wasm", // TODO use "webgpu" when bug is fixed
              language_model: "webgpu",
              lm_head: "webgpu",
              gen_head: "webgpu",
              gen_img_embeds: "webgpu",
              image_decode: "webgpu",
            },
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
          }
        );
        this.tokenizer = this.processor.tokenizer;
        this.isLoaded = true;
        break;
      }
      case "default-type": {
        this.pipeline = await pipeline<"text-generation">(
          "text-generation",
          modelConfig.name,
          {
            dtype: modelConfig.dtype,
            device: device || modelConfig.device,
            model_file_name: modelConfig.modelFileName,
            progress_callback: this.onProgressChange,
            subfolder: modelConfig.subfolder,
          }
        );
        this.tokenizer = this.pipeline.tokenizer;
        this.model = this.pipeline.model;
        this.isLoaded = true;
        break;
      }
    }
  };
}

let model: ChatModel | undefined;

self.addEventListener("message", async (e) => {
  const { event, payload } = e.data;
  switch (event) {
    case "load":
      model = new ChatModel(payload.modelName);
      await model.load(payload.device);
      self.postMessage({
        event: "onLoad",
        payload: {
          isSystemRoleSupported: model.isSystemRoleSupported(),
        },
      });
      break;
    case "setMessages":
      if (!model) {
        throw new Error("No model found");
      }
      model.setMessages([...payload.messages]);
      break;
    case "addMessage":
      if (!model) {
        throw new Error("No model found");
      }
      model.addMessage(payload);
      break;
    case "prompt":
      if (!model) {
        throw new Error("No model found");
      }
      model.prompt(payload);
      break;
  }
});
