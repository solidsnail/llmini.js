import { useEffect, useRef, useState, type FC } from "react";
import { UI } from "llmini.js/ui";
import type { TypeProgress } from "../../lib/types";
import { TextToSpeechSDK } from "../../lib/categories/text-to-speech";
import { ImageTextToTextSDK } from "../../lib/categories/image-text-to-text";

export const SectionExamples: FC = () => {
  const [regionImageB64, setRegionImageB64] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [question, setQuestion] = useState("Please describe the picture");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progressInfo, setProgressInfo] = useState<TypeProgress>();
  const sdkRef = useRef<ImageTextToTextSDK | null>(null);
  const ttsSdkRef = useRef<TextToSpeechSDK | null>(null);

  const onSubmit = async () => {
    setBusy(true);
    await sdkRef.current?.ask(question, regionImageB64);
  };
  const loadModel = async () => {
    setBusy(true);
    await ttsSdkRef.current?.load();
    await sdkRef.current?.load();
    await ttsSdkRef.current?.warmUp();
    await sdkRef.current?.warmUp();
    setLoaded(true);
    setBusy(false);
  };

  useEffect(() => {
    ttsSdkRef.current = new TextToSpeechSDK(
      "Kokoro-82M-v1.0-ONNX",
      true,
      "webgpu",
      {
        onResult(audioBase64) {
          const audio = new Audio(audioBase64);
          audio.play();
          setBusy(false);
        },
      }
    );
    sdkRef.current = new ImageTextToTextSDK(
      "FastVLM-0.5B-ONNX",
      true,
      "webgpu",
      {
        onProgressChange: setProgressInfo,
        onError(error) {
          setError(error);
          setBusy(false);
        },
        async onResult(message) {
          if (
            !message.startsWith(
              "The image you provided appears to be a blank or white square"
            )
          ) {
            console.log({ message });
            ttsSdkRef.current?.speak(message, "am_puck");
          }
        },
      }
    );
    return () => {
      sdkRef.current?.destroy();
    };
  }, []);

  return (
    <UI.Flex justify="flex-start" align="flex-start" gap={20} flex={1} h="100%">
      {error}
      <UI.Flex
        h="100%"
        p="10px"
        align="flex-start"
        justify="flex-start"
        direction="column"
        border="1px solid var(--colors-c)"
      >
        <UI.Button
          w="100%"
          checked
          variant="outlined"
          text="Interactive image describer"
        />
      </UI.Flex>
      <UI.Flex
        flex={1}
        h="100%"
        p="10px"
        align="flex-start"
        justify="flex-start"
        direction="column"
        position="relative"
      >
        <UI.ImageCanvas
          regionImageB64={regionImageB64}
          setRegionImageB64={setRegionImageB64}
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
        />
        <UI.Flex w="100%" gap={10} h={100}>
          <UI.ModelLoader
            error={error}
            loaded={loaded}
            disabled={busy}
            progressInfo={progressInfo}
            loadModel={loadModel}
          />
          <UI.Input
            multiline
            h="100%"
            value={question}
            onChange={(v) => setQuestion(v as string)}
            disabled={busy || !loaded}
            placeholder="Write your question here"
            flex={1}
          />
          <UI.Button
            icon={busy ? <UI.Spinner /> : undefined}
            onClick={onSubmit}
            disabled={busy || !loaded || !question || !regionImageB64}
            text="Ask"
          />
        </UI.Flex>
      </UI.Flex>
    </UI.Flex>
  );
};
