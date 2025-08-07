import type { FC } from "react";
import { type ProgressInfo } from "@huggingface/transformers";
import { getComponentStyle, UI, type TypeCommonProps } from ".";

type Props = {
  progressInfo: ProgressInfo;
  isInfinite?: boolean;
} & TypeCommonProps;
const Component: FC<Props> = ({
  progressInfo,
  isInfinite = false,
  ...props
}) => {
  return (
    <div className="ui-progress" style={getComponentStyle(props)}>
      {progressInfo?.status === "progress" && (
        <>
          {isInfinite ? (
            <UI.Spinner />
          ) : (
            <progress max="100" value={progressInfo.progress.toFixed(2)}>
              {progressInfo.progress.toFixed(2)}%
            </progress>
          )}
          {!isInfinite && <span>{progressInfo.progress.toFixed(2)}%</span>}
          <span>Downloading model {progressInfo.name}</span>
        </>
      )}
      {progressInfo?.status === "initiate" && (
        <>
          {isInfinite ? <UI.Spinner /> : <progress />}
          <span>Initiating model {progressInfo.name} download</span>
        </>
      )}
      {progressInfo?.status === "done" && (
        <>
          {isInfinite ? (
            <UI.Spinner />
          ) : (
            <progress max="100" value="100">
              100%
            </progress>
          )}
          <span>Setting up model {progressInfo.name}</span>
        </>
      )}
      {progressInfo?.status === "download" && (
        <>
          {isInfinite ? (
            <UI.Spinner />
          ) : (
            <progress max="100" value="100">
              100%
            </progress>
          )}
          <span>Downloaded model {progressInfo.name}</span>
        </>
      )}
    </div>
  );
};
Component.displayName = "UiProgress";
export default Component;
