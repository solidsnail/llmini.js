import { useEffect, useRef, useState, type FC } from "react";
import {
  type ObjectDetectionPipelineOutput,
  type ProgressInfo,
} from "@huggingface/transformers";
import { Link, Scan } from "lucide-react";

import { type TypeModelName } from "./config";
import { UI } from "../../ui";
import { ICON_SIZE } from "../../constants";
import type { TypeDevice } from "../../types";
import SDK from "./sdk";

type Props = {
  modelName?: TypeModelName;
  withWorker?: boolean;
  device?: TypeDevice;
  width?: string;
  height?: string;
};
export const ObjectDetectionComponent: FC<Props> = ({
  modelName = "detr-resnet-50",
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
  const [attachedImg, setAttachedImg] = useState("");
  const [result, setResult] = useState<ObjectDetectionPipelineOutput>();

  const onSubmit = async () => {
    setBusy(true);
    await sdkRef.current?.detect(attachedImg);
  };

  const loadModel = async () => {
    await sdkRef.current?.load();
    setLoaded(true);
  };

  useEffect(() => {
    sdkRef.current = new SDK(modelName, withWorker, device, {
      onProgressChange: setProgressInfo,
      onResult(result) {
        setBusy(false);
        setResult(result);
      },
      onError: (err) => {
        setError(err);
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
        text="Attach image"
        variant="outlined"
        type="file"
        radius="20px"
        disabled={busy}
        icon={<Link size={ICON_SIZE} />}
        onAttach={({ base64 }) => {
          setAttachedImg(base64);
        }}
      />
      <UI.Button
        type="button"
        disabled={busy || !attachedImg || !loaded}
        text="Detect objects"
        onClick={onSubmit}
        icon={busy ? <UI.Spinner /> : <Scan size={ICON_SIZE} />}
      />
      {result && (
        <UI.Message
          w="100%"
          message={{
            role: "assistant",
            content: "```json\n" + JSON.stringify(result, null, "  ") + "\n```",
          }}
        />
      )}
    </UI.Flex>
  );
};
