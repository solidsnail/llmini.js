import { useEffect, useRef, useState, type FC } from "react";
import { type ProgressInfo } from "@huggingface/transformers";

import { FileAudio, Text } from "lucide-react";

import { type TypeModelName } from "./config";
import { UI } from "../../ui";
import { ICON_SIZE } from "../../constants";
import type { TypeDevice } from "../../types";
import SDK from "./sdk";

type Props = {
  modelName?: TypeModelName;
  withWorker?: boolean;
  defaultAudio?: string;
  device?: TypeDevice;
  width?: string;
  height?: string;
};

export const AudioTextToTextComponent: FC<Props> = ({
  modelName = "ultravox-v0_5-llama-3_2-1b-ONNX",
  withWorker = true,
  device,
  defaultAudio = "",
  width,
  height,
}) => {
  const sdkRef = useRef<SDK>(undefined);

  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [audioBase64, setAudioBase64] = useState(defaultAudio);
  const [audioArrayBuffer, setAudioArrayBuffer] = useState(new ArrayBuffer());
  const [busy, setBusy] = useState(false);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();

  const onSubmit = async () => {
    setBusy(true);
    await sdkRef.current?.transcribe(audioArrayBuffer);
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
      <UI.Text tagName="b" text={modelName} p="0px 10px" w="100%" />
      {error && <div className="ui-error">{error}</div>}
      <UI.ModelLoader
        error={error}
        loaded={loaded}
        progressInfo={progressInfo}
        loadModel={loadModel}
      />
      <UI.Input
        text="Attach audio"
        variant="outlined"
        type="file"
        radius="20px"
        maxFileSize={2000000}
        disabled={busy}
        accept="audio/*"
        icon={<FileAudio size={ICON_SIZE} />}
        onAttach={async ({ base64, arrayBuffer }) => {
          setAudioBase64(base64);
          setAudioArrayBuffer(arrayBuffer);
        }}
      />
      <UI.Button
        type="button"
        disabled={busy || !audioBase64 || !loaded}
        text="Transcribe"
        onClick={onSubmit}
        icon={busy ? <UI.Spinner /> : <Text size={ICON_SIZE} />}
      />
      <UI.Audio w="100%" h={30} src={audioBase64} />
      <UI.Text text={busy ? "Transcribing, please wait..." : result} />
    </UI.Flex>
  );
};
