import { lazy, type CSSProperties } from "react";

export const UI = {
  Button: lazy(() => import("./button")),
  Input: lazy(() => import("./input")),
  Flex: lazy(() => import("./flex")),
  Text: lazy(() => import("./text")),
  Progress: lazy(() => import("./progress")),
  Messages: lazy(() => import("./messages")),
  Message: lazy(() => import("./message")),
  Spinner: lazy(() => import("./spinner")),
  Select: lazy(() => import("./select")),
  Audio: lazy(() => import("./audio")),
  ModelLoader: lazy(() => import("./model-loader")),
  Logo: lazy(() => import("./logo")),
};
export type TypeCommonProps = {
  bg?: CSSProperties["background"];
  c?: CSSProperties["color"];
  p?: CSSProperties["padding"];
  m?: CSSProperties["margin"];
  flex?: CSSProperties["flex"];
  w?: CSSProperties["width"];
  h?: CSSProperties["height"];
  miw?: CSSProperties["minWidth"];
  mih?: CSSProperties["minHeight"];
  radius?: CSSProperties["borderRadius"];
  border?: CSSProperties["border"];
  position?: CSSProperties["position"];
  fz?: CSSProperties["fontSize"];
  fw?: CSSProperties["fontWeight"];
  ta?: CSSProperties["textAlign"];
};
export const getComponentStyle = ({
  bg,
  c,
  p,
  m,
  flex,
  w,
  h,
  miw,
  mih,
  radius,
  border,
  position,
  ta,
  fz,
  fw,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...other
}: TypeCommonProps & Record<string, unknown>): CSSProperties => {
  return {
    flex,
    background: bg,
    color: c,
    width: w,
    height: h,
    padding: p,
    margin: m,
    minWidth: miw,
    minHeight: mih,
    borderRadius: radius,
    border,
    position,
    textAlign: ta,
    fontSize: fz,
    fontWeight: fw,
  };
};
