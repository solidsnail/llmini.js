import { useEffect, useRef, type FC } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import DOMPurify from "dompurify";

import type { TypeMessage } from "../categories/chat/model";
import { getComponentStyle, type TypeCommonProps } from ".";

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      const codeHtml = hljs.highlight(code, { language }).value;

      return (
        codeHtml +
        renderToStaticMarkup(
          <button
            data-code={code}
            type="button"
            className="hljs-copy-button"
            title="Copy code"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
              <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
            </svg>
          </button>
        )
      );
    },
  })
);

type Props = {
  message: TypeMessage;
} & TypeCommonProps;
const Component: FC<Props> = ({ message, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  const highlight = (code: string) => {
    const raw = marked.parse(code) as string;
    return DOMPurify.sanitize(raw);
  };

  const registerCopyButton = () => {
    const onCopy = (event: MouseEvent) => {
      const button = event.currentTarget as HTMLButtonElement;
      const code = button.getAttribute("data-code");
      if (code) {
        navigator.clipboard.writeText(code);
      }
    };
    if (ref.current) {
      const copyButtons = Array.from(
        ref.current.querySelectorAll(".hljs-copy-button")
      ) as HTMLButtonElement[];
      for (const copyButton of copyButtons) {
        copyButton.removeEventListener("click", onCopy);
        copyButton.addEventListener("click", onCopy);
      }
    }
  };
  useEffect(() => {
    registerCopyButton();
  }, [message]);
  return (
    <div
      ref={ref}
      className="ui-message"
      data-role={message.role}
      style={getComponentStyle(props)}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: highlight(message.content),
        }}
      />
      {(message.images || []).map((base64Img, i) => {
        return (
          <div key={i}>
            <img width="100px" src={base64Img} alt="Attached image" />
          </div>
        );
      })}
    </div>
  );
};
Component.displayName = "UiMessage";
export default Component;
