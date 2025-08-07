import type { FC } from "react";
import { getComponentStyle, type TypeCommonProps } from ".";

type Props = {
  src: string;
} & TypeCommonProps;
const Component: FC<Props> = ({ src, ...props }) => {
  return <audio style={getComponentStyle(props)} src={src} controls />;
};
Component.displayName = "UiAudio";
export default Component;
