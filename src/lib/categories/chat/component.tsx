import {
  useEffect,
  useRef,
  useState,
  type FC,
  type FormEvent,
  type KeyboardEventHandler,
} from "react";
import { type ProgressInfo } from "@huggingface/transformers";

import { ArrowUp, Image, Link } from "lucide-react";

import { CONFIG, type TypeModelName } from "./config";
import { type TypeMessage } from "./model";
import { getComponentStyle, UI } from "../../ui";
import { ICON_SIZE } from "../../constants";
import type { TypeDevice } from "../../types";
import SDK from "./sdk";

type Props = {
  modelName?: TypeModelName;
  system?: string;
  defaultPrompt?: string;
  defaultMessages?: TypeMessage[];
  maxTokens?: number;
  withWorker?: boolean;
  config?: typeof CONFIG;
  device?: TypeDevice;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  characterTimeout?: number;
  width?: string;
  height?: string;
};
export const ChatComponent: FC<Props> = ({
  modelName = "Phi-3.5-mini-instruct-onnx-web",
  system = "You are a helpful assistant who responds only in English.",
  defaultPrompt = "",
  defaultMessages = [],
  maxTokens = 1024,
  withWorker = true,
  config = CONFIG,
  device = undefined,
  temperature = 0.5,
  top_k = 50,
  top_p = 1,
  characterTimeout = undefined,
  width = "400px",
  height = "500px",
  ...props
}) => {
  const sdkRef = useRef<SDK>(undefined);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isImageGen, setIsImageGen] = useState(false);
  const [attachedImg, setAttachedImg] = useState("");
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();
  const formRef = useRef<HTMLFormElement>(null);
  const [messages, setMessages] = useState<TypeMessage[]>(defaultMessages);
  const [prompt, setPrompt] = useState(defaultPrompt);

  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.code === "Enter" && !event.shiftKey && formRef.current) {
      event.preventDefault();
      formRef.current.requestSubmit();
    }
  };

  const registerCopyButtons = () => {
    const formEl = formRef.current;
    const onCopy = (event: MouseEvent) => {
      const button = event.currentTarget as HTMLButtonElement;
      const code = button.getAttribute("data-code");
      if (code) {
        navigator.clipboard.writeText(code);
      }
    };
    if (formEl) {
      const copyButtons = Array.from(
        formEl.querySelectorAll(".hljs-copy-button")
      ) as HTMLButtonElement[];
      for (const copyButton of copyButtons) {
        copyButton.removeEventListener("click", onCopy);
        copyButton.addEventListener("click", onCopy);
      }
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setBusy(true);
      setPrompt("");
      sdkRef.current?.sendMessage({
        prompt,
        settings: {
          characterTimeout,
          maxTokens,
          temperature,
          top_k,
          top_p,
        },
        attachedImg,
        isImageGen,
      });
    } catch (error) {
      setError((error as Error).message);
      setBusy(false);
    }
  };
  const loadModel = async () => {
    await sdkRef.current?.load();
    setLoaded(true);
  };

  useEffect(() => {
    registerCopyButtons();
  }, [messages]);

  useEffect(() => {
    sdkRef.current = new SDK(modelName, {
      withWorker,
      device,
      defaultMessages,
      system,
      callbacks: {
        onProgressChange: setProgressInfo,
        onError: (err) => {
          setError(err);
          setBusy(false);
        },
        onMessagesChange(messages) {
          setMessages(messages);
        },
        onDone() {
          setBusy(false);
          setIsImageGen(false);
        },
      },
    });

    return () => {
      sdkRef.current?.destroy();
    };
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="ui-form"
      style={getComponentStyle({
        w: width,
        h: height,
        ...props,
      })}
    >
      <UI.Text tagName="b" text={modelName} p="0px 10px" w="100%" />
      {error && <div className="ui-error">{error}</div>}
      <UI.ModelLoader
        error={error}
        loaded={loaded}
        progressInfo={progressInfo}
        loadModel={loadModel}
      />
      <UI.Messages>
        {messages
          .filter((message) => message.role !== "system")
          .map((message, index) => (
            <UI.Message key={index} message={message} />
          ))}
      </UI.Messages>
      <UI.Flex bg="white" radius="20px" direction="column" align="flex-start">
        <UI.Input
          value={prompt}
          onChange={(value) => setPrompt(value as string)}
          required
          multiline
          w="100%"
          placeholder={
            busy
              ? "Generating response, please wait..."
              : isImageGen
              ? "Describe the image you want to generate"
              : attachedImg
              ? "What do you want to know about the attached image ?"
              : "Ask anything"
          }
          disabled={busy}
          onKeyDown={onKeyDown}
        />
        <UI.Flex w="100%" p="5px">
          <UI.Flex gap={5} flex={1}>
            {config[modelName].pretrained === "MultiModalityCausalLM" && (
              <>
                <UI.Button
                  checked={isImageGen}
                  onClick={() => setIsImageGen((old) => !old)}
                  variant="outlined"
                  disabled={!!attachedImg || busy}
                  text="Generate image"
                  icon={<Image size={ICON_SIZE} />}
                />
                <UI.Input
                  text="Attach image"
                  variant="outlined"
                  type="file"
                  radius="var(--radius)"
                  disabled={isImageGen || busy}
                  icon={<Link size={ICON_SIZE} />}
                  onAttach={({ base64 }) => {
                    setAttachedImg(base64);
                  }}
                />
              </>
            )}
          </UI.Flex>
          <UI.Button
            disabled={busy || !loaded}
            type="submit"
            text="Send"
            icon={<ArrowUp size={ICON_SIZE} />}
          />
        </UI.Flex>
      </UI.Flex>
      <UI.Text
        ta="center"
        text="AI can be wrong, always double check important info"
        
        c="var(--colors-d)"
      />
    </form>
  );
};
