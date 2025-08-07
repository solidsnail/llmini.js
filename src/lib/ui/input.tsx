import {
  useState,
  type ChangeEvent,
  type FC,
  type HTMLInputTypeAttribute,
  type KeyboardEventHandler,
  type ReactNode,
} from "react";
import { getComponentStyle, type TypeCommonProps } from ".";

type Props = {
  disabled?: boolean;
  variant?: "filled" | "outlined";
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  accept?: "image/*" | "audio/*" | "video/*";
  text?: string;
  value?: string | number;
  icon?: ReactNode;
  flex?: number;
  min?: number;
  max?: number;
  step?: number;
  maxFileSize?: number;
  onAttach?: (args: { base64: string; arrayBuffer: ArrayBuffer }) => void;
  onChange?: (value: string | number) => void;
  onKeyDown?: KeyboardEventHandler;
} & TypeCommonProps;
const Component: FC<Props> = ({
  variant = "filled",
  type = "text",
  placeholder,
  multiline,
  required = false,
  icon,
  text,
  disabled,
  value,
  min = 0.1,
  max = 4,
  step = 0.1,
  accept = "image/*",
  maxFileSize = 4000000,
  onKeyDown,
  onChange,
  onAttach,
  ...props
}) => {
  const [attachedFile, setAttachedFile] = useState<File>();

  const onValueChange = (args: {
    base64: string;
    arrayBuffer: ArrayBuffer;
  }) => {
    if (onAttach) {
      onAttach(args);
    }
  };
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size >= maxFileSize) {
        alert(
          `File is too big! Attach an image less or equal to ${
            maxFileSize / 1000
          }kb`
        );
        e.target.value = "";
        return;
      }
      setAttachedFile(file);
      const base64Reader = new FileReader();
      const arrayBufferReader = new FileReader();
      base64Reader.onload = () => {
        arrayBufferReader.onload = () => {
          if (arrayBufferReader.result && base64Reader.result) {
            const base64 = base64Reader.result as string;
            const arrayBuffer = arrayBufferReader.result as ArrayBuffer;
            onValueChange({
              base64,
              arrayBuffer,
            });
          }
        };
        arrayBufferReader.readAsArrayBuffer(file);
      };

      base64Reader.readAsDataURL(file);
    }
  };

  if (type === "file") {
    return (
      <label
        className="ui-input"
        data-variant={variant}
        data-type={type}
        aria-checked={!!attachedFile}
        aria-disabled={disabled}
        style={getComponentStyle(props)}
        onContextMenu={(event) => {
          event.preventDefault();
          const inputEl = event.currentTarget.querySelector(
            "input"
          ) as HTMLInputElement;
          inputEl.value = "";
          setAttachedFile(undefined);
        }}
      >
        <input
          onKeyDown={onKeyDown}
          onChange={onFileChange}
          hidden
          type={type}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          accept={accept}
        />
        {icon}
        {text}
      </label>
    );
  }
  const Tagname = multiline ? "textarea" : "input";
  return (
    <Tagname
      type={type}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      data-variant={variant}
      aria-disabled={disabled}
      min={min}
      max={max}
      step={step}
      value={value}
      onKeyDown={onKeyDown}
      onChange={(event) => {
        if (onChange) {
          onChange(event.target.value);
        }
      }}
      style={getComponentStyle(props)}
      className="ui-input"
    />
  );
};
Component.displayName = "UiInput";
export default Component;
