import type { FC, PropsWithChildren } from "react";
import { RefreshCcw } from "lucide-react";
import { type ProgressInfo } from "@huggingface/transformers";

import { UI } from ".";
import { ICON_SIZE } from "../constants";

const INFINITE_MODELS = ["ultravox-v0_5-llama-3_2-1b-ONNX", "OuteTTS-0.2-500M"];

type Props = PropsWithChildren<{
  loadModel: () => void;
  loaded: boolean;
  error: string;
  progressInfo: ProgressInfo | undefined;
}>;
const Component: FC<Props> = ({ loadModel, loaded, error, progressInfo }) => {
  return (
    <>
      {!error && progressInfo && progressInfo.status !== "ready" && (
        <UI.Progress
          progressInfo={progressInfo}
          isInfinite={INFINITE_MODELS.includes(progressInfo.name)}
        />
      )}
      {!loaded && (
        <UI.Button
          icon={<RefreshCcw size={ICON_SIZE} />}
          onClick={loadModel}
          text="Load model"
        />
      )}
    </>
  );
};
Component.displayName = "UiModelLoader";
export default Component;
