import type { FC } from "react";
import { BotMessageSquare } from "lucide-react";

import { UI } from ".";

const Component: FC = () => {
  return (
    <UI.Flex radius={20} bg="var(--colors-b)" p="20px" gap={10}>
      <UI.Flex bg="var(--colors-f)" p="5px" radius={10}>
        <BotMessageSquare strokeWidth={1} size={60} color="var(--colors-b)" />
      </UI.Flex>
      <UI.Text text="llmini.js" fz="40px" fw="600" c="var(--colors-f)" />
    </UI.Flex>
  );
};
Component.displayName = "UiLogo";
export default Component;
