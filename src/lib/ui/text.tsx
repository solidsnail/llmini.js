import type { FC } from "react";
import { getComponentStyle, type TypeCommonProps } from ".";

type Props = {
  text: string;
  ta?: "left" | "center" | "right";
  tagName?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "b" | "i";
} & TypeCommonProps;
const Component: FC<Props> = (props) => {
  const Tagname = props.tagName || "span";
  return (
    <Tagname className="ui-text" style={getComponentStyle(props)}>
      {props.text}
    </Tagname>
  );
};
Component.displayName = "UiText";
export default Component;
