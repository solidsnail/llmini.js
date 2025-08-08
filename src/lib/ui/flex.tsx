import type { FC, PropsWithChildren } from "react";
import { getComponentStyle, type TypeCommonProps } from ".";

type Props = PropsWithChildren<
  {
    direction?: "row" | "column";
    align?:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
    justify?:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
    gap?: number;
    wrap?: boolean;
  } & TypeCommonProps
>;
const Component: FC<Props> = ({
  children,
  align = "center",
  direction = "row",
  gap = undefined,
  justify = "center",
  wrap = false,
  ...props
}) => {
  return (
    <div
      className="ui-flex"
      style={{
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,

        gap,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...getComponentStyle(props),
      }}
    >
      {children}
    </div>
  );
};
Component.displayName = "UiFlex";
export default Component;
