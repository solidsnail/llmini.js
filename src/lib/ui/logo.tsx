import type { FC } from "react";
import { BotMessageSquare } from "lucide-react";

import { UI } from ".";

type Props = {
  size?: number
}
const Component: FC<Props> = ({size = 30}) => {
  return (
    <UI.Flex radius={20} bg="var(--colors-b)" p={size / 3 + "px"} gap={10}>
      <UI.Flex bg="var(--colors-f)" p="5px" radius={10}>
        <BotMessageSquare strokeWidth={2} size={size} color="var(--colors-b)" />
      </UI.Flex>
      <UI.Text text="llmini.js" fz={size / 1.5 + "px"} fw="600" c="var(--colors-f)" />
    </UI.Flex>
  );
};
Component.displayName = "UiLogo";
export default Component;
