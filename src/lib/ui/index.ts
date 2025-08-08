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
  ImageCanvas: lazy(() => import("./image-canvas")),
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
  zIndex?: CSSProperties["zIndex"];
  fz?: CSSProperties["fontSize"];
  fw?: CSSProperties["fontWeight"];
  ta?: CSSProperties["textAlign"];
  overflow?: CSSProperties["overflow"];
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
  zIndex,
  overflow,
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
    zIndex,
    overflow,
  };
};
