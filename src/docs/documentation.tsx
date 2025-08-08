import "highlight.js/styles/github.css";

import "llmini.js/themes/basic.css";
import { UI } from "llmini.js/ui";
import { useState } from "react";
import { SectionComponents } from "./sections/components";
import { SectionExamples } from "./sections/examples";
import { SectionGettingStarted } from "./sections/getting-started";

type TypeSection = "getting-started" | "components" | "examples";
function App() {
  const [section, setSection] = useState<TypeSection>("getting-started");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 20,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <UI.Flex
        gap={5}
        w={160}
        h="100%"
        p="10px"
        justify="flex-start"
        direction="column"
        border="1px solid var(--colors-c)"
        bg="var(--colors-a)"
        position="fixed"
        zIndex={999}
      >
        <UI.Logo />
        <hr style={{ width: "100%", border: "1px solid var(--colors-c)" }} />
        <UI.Button
          variant="outlined"
          w="100%"
          onClick={() => setSection("getting-started")}
          checked={section === "getting-started"}
          text="Getting started"
        />
        <UI.Button
          variant="outlined"
          w="100%"
          onClick={() => setSection("components")}
          checked={section === "components"}
          text="Components"
        />
        <UI.Button
          variant="outlined"
          w="100%"
          onClick={() => setSection("examples")}
          checked={section === "examples"}
          text="Examples"
        />
      </UI.Flex>

      <UI.Flex
        p={`0px 0px 0px ${160}px`}
        flex={1}
        h="100%"
        bg="var(--colors-a)"
        justify="flex-start"
        align="flex-start"
      >
        {section === "getting-started" && <SectionGettingStarted />}
        {section === "components" && <SectionComponents />}
        {section === "examples" && <SectionExamples />}
      </UI.Flex>
    </div>
  );
}

export default App;
