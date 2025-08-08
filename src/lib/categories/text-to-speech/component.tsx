import { useEffect, useRef, useState, type FC } from "react";
import { type ProgressInfo } from "@huggingface/transformers";

import { Speech } from "lucide-react";

import {
  kokoroVoicesOptions,
  type TypeModelName,
  type TypeKokoroVoice,
  type TypeOutettsVoice,
  outettsVoicesOptions,
} from "./config";
import { UI } from "../../ui";
import { ICON_SIZE } from "../../constants";
import type { TypeDevice } from "../../types";
import SDK from "./sdk";

type Props = {
  modelName?: TypeModelName;
  defaultText?: string;
  withWorker?: boolean;
  device?: TypeDevice;
  width?: string;
  height?: string;
};
export const TextToSpeechComponent: FC<Props> = ({
  modelName = "Kokoro-82M-v1.0-ONNX",
  defaultText = "Hello, how can I help you today ?",
  withWorker = true,
  device,
  width,
  height,
}) => {
  const sdkRef = useRef<SDK>(undefined);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();
  const [text, setText] = useState(defaultText);
  const [speed, setSpeed] = useState(1);
  const [voice, setVoice] = useState<TypeKokoroVoice | TypeOutettsVoice>(
    modelName === "Kokoro-82M-v1.0-ONNX" ? "am_puck" : "male_1"
  );
  const [result, setResult] = useState<string>("");

  const onSubmit = async () => {
    setBusy(true);
    await sdkRef.current?.speak(text, voice, speed);
  };

  const loadModel = async () => {
    await sdkRef.current?.load();
    setLoaded(true);
  };

  useEffect(() => {
    sdkRef.current = new SDK(modelName, withWorker, device, {
      onProgressChange: setProgressInfo,
      onResult: (result) => {
        setResult(result);
        setBusy(false);
      },
      onError: (err) => {
        setError(err);
        setBusy(false);
      },
      onDone() {
        setBusy(false);
      },
    });

    return () => {
      sdkRef.current?.destroy();
    };
  }, []);

  return (
    <UI.Flex
      bg="var(--colors-b)"
      p="5px"
      radius="20px"
      gap={5}
      position="relative"
      justify="flex-start"
      w={width}
      h={height}
      wrap
    >
      {" "}
      <UI.Text tagName="b" text={modelName} p="0px 10px" w="100%" />
      {error && <div className="ui-error">{error}</div>}
      <UI.ModelLoader
        error={error}
        loaded={loaded}
        progressInfo={progressInfo}
        loadModel={loadModel}
      />
      <UI.Input
        value={text}
        onChange={(value) => setText(value as string)}
        required
        multiline
        radius="20px"
        h="30px"
        flex={1}
        miw="100px"
        placeholder="Type your text to speak here"
        disabled={busy}
      />
      <UI.Select
        disabled={busy}
        value={voice as string}
        onChange={(value) => setVoice(value as TypeKokoroVoice)}
        options={
          modelName === "Kokoro-82M-v1.0-ONNX"
            ? kokoroVoicesOptions
            : outettsVoicesOptions
        }
      />
      {modelName === "Kokoro-82M-v1.0-ONNX" && (
        <UI.Input
          type="number"
          radius="20px"
          value={speed}
          onChange={(value) => setSpeed(value as number)}
        />
      )}
      <UI.Button
        type="button"
        disabled={busy || !loaded}
        text="Speak"
        onClick={onSubmit}
        icon={busy ? <UI.Spinner /> : <Speech size={ICON_SIZE} />}
      />
      <UI.Audio w="100%" h={30} src={result} />
    </UI.Flex>
  );
};
