import type { FC } from "react";
import { getComponentStyle, type TypeCommonProps } from ".";

type Props = {
  value: string;
  onChange: (value: string) => void;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  options: { label: string; value: string }[];
} & TypeCommonProps;
const Component: FC<Props> = ({
  variant = "filled",
  options,
  disabled,
  value,
  onChange,
  ...props
}) => {
  return (
    <select
      disabled={disabled}
      data-variant={variant}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ui-select"
      style={getComponentStyle(props)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
Component.displayName = "UiSelect";
export default Component;
