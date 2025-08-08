import type { FC } from "react";
import { UI } from "llmini.js/ui";
import { AudioTextToTextComponent } from "llmini.js/categories/audio-text-to-text";
import { ChatComponent } from "llmini.js/categories/chat";
import { DepthEstimationComponent } from "llmini.js/categories/depth-estimation";
import { DocumentQuestionAnsweringComponent } from "llmini.js/categories/document-question-answering";
import { ImageClassificationComponent } from "llmini.js/categories/image-classification";
import { ImageTextToTextComponent } from "llmini.js/categories/image-text-to-text";
import { ObjectDetectionComponent } from "llmini.js/categories/object-detection";
import { TextToSpeechComponent } from "llmini.js/categories/text-to-speech";
import { VisualQuestionAnsweringComponent } from "llmini.js/categories/visual-question-answering";

export const SectionComponents: FC = () => {
  return (
    <UI.Flex wrap justify="flex-start" align="flex-start" gap={20} p="10px">
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Audio to text" />
        <AudioTextToTextComponent modelName="Voxtral-Mini-3B-2507-ONNX" />
      </UI.Flex>
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Depth estimation" />
        <DepthEstimationComponent modelName="depth-anything-small-hf" />
      </UI.Flex>
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Document question answering" />
        <DocumentQuestionAnsweringComponent
          width="400px"
          modelName="donut-base-finetuned-docvqa"
        />
      </UI.Flex>
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Image classification" />
        <ImageClassificationComponent
          width="400px"
          modelName="facial_emotions_image_detection"
        />
      </UI.Flex>
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Image text to text" />
        <ImageTextToTextComponent width="400px" modelName="FastVLM-0.5B-ONNX" />
      </UI.Flex>
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Chat" />
        <ChatComponent height="400px" modelName="FastThink-0.5B-Tiny" />
      </UI.Flex>{" "}
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Object detection" />
        <ObjectDetectionComponent width="400px" modelName="detr-resnet-50" />
      </UI.Flex>
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Text to speech" />
        <TextToSpeechComponent width="400px" modelName="Kokoro-82M-v1.0-ONNX" />
      </UI.Flex>
      <UI.Flex direction="column">
        <UI.Text tagName="h3" text="Visual question answering" />
        <VisualQuestionAnsweringComponent modelName="Janus-Pro-1B-ONNX" />
      </UI.Flex>
    </UI.Flex>
  );
};
