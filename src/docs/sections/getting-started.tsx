import type { FC } from "react";
import { UI } from "../../lib/ui";
import { TextToSpeechComponent } from "../../lib/categories/text-to-speech";

export const SectionGettingStarted: FC = () => {
  return (
    <UI.Flex
      direction="column"
      bg="var(--colors-b)"
      flex={1}
      h="100%"
      wrap
      justify="flex-start"
      align="flex-start"
      gap={20}
      p="10px"
      overflow="auto"
    >
      <UI.Message
        message={{
          role: "assistant",
          content: "```bash\nnpm install llmini.js\n```",
        }}
      />
      <UI.Flex>
        <UI.Message
          h="100%"
          message={{
            role: "assistant",
            content:
              "```tsx\n" +
              `import { TextToSpeechComponent } from "llmini.js/categories/text-to-speech";\n` +
              `import "llmini.js/themes/basic.css";\n\n` +
              `function MyTTS(){\n` +
              `   return <TextToSpeechComponent 
            defaultText="Hello, my name is John Doe" 
            modelName="Kokoro-82M-v1.0-ONNX" />;\n` +
              `}\n` +
              "\n```",
          }}
        />
        <b>OR</b>
        <UI.Message
          h="100%"
          message={{
            role: "assistant",
            content:
              "```tsx\n" +
              `import { TextToSpeechSDK } from "llmini.js/categories/text-to-speech";

const ttsSDK = new TextToSpeechSDK("Kokoro-82M-v1.0-ONNX", true, "webgpu", {
  onResult: (audioBase64) => {
    const audio = new Audio(\`data:audio/wav;base64,\${audioBase64}\`);
    audio.play();
  }
});

await ttsSDK.load();
await ttsSDK.speak("Hello, my name is John Doe", "am_puck", 1.0);` +
              "\n```",
          }}
        />
      </UI.Flex>
      <UI.Flex p="20px" bg="var(--colors-c)">
        <TextToSpeechComponent defaultText="Hello, my name is John Doe" />
      </UI.Flex>
    </UI.Flex>
  );
};
