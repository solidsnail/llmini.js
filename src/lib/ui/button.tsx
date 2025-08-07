import type { FC, ReactNode } from "react";
import { getComponentStyle, type TypeCommonProps } from ".";

type Props = {
  text: string;
  icon?: ReactNode;
  disabled?: boolean;
  checked?: boolean;
  onClick?: (checked?: boolean) => void;
  variant?: "filled" | "outlined";
  type?: "button" | "submit" | "reset";
} & TypeCommonProps;
const Component: FC<Props> = ({
  checked,
  onClick,
  variant = "filled",
  type = "button",
  disabled,
  text,
  icon,
  ...props
}) => {
  if (typeof checked === "boolean") {
    return (
      <label
        className="ui-button"
        data-variant={variant}
        aria-checked={checked}
        aria-disabled={disabled}
        style={getComponentStyle(props)}
      >
        <input
          type="checkbox"
          hidden
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            if (onClick) {
              onClick(event.target.checked);
            }
          }}
        />
        {icon} {text}
      </label>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      data-variant={variant}
      className="ui-button"
      onClick={onClick ? () => onClick() : undefined}
      style={getComponentStyle(props)}
    >
      {icon}
      {text}
    </button>
  );
};
Component.displayName = "UiButton";
export default Component;
