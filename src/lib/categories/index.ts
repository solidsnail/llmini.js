import { AudioTextToTextModel } from "./audio-text-to-text/model";
import { ChatModel } from "./chat/model";
import { DepthEstimationModel } from "./depth-estimation/model";
import { DocumentQuestionAnsweringModel } from "./document-question-answering/model";
import { ImageClassificationModel } from "./image-classification/model";
import { ImageTextToTextModel } from "./image-text-to-text/model";
import { ObjectDetectionModel } from "./object-detection/model";
import { TextToSpeechModel } from "./text-to-speech/model";

export const CATEGORIES_MODELS = {
  chat: ChatModel,
  "audio-text-to-text": AudioTextToTextModel,
  "image-text-to-text": ImageTextToTextModel,
  "text-to-speech": TextToSpeechModel,
  "depth-estimation": DepthEstimationModel,
  "document-question-answering": DocumentQuestionAnsweringModel,
  "image-classification": ImageClassificationModel,
  "object-detection": ObjectDetectionModel,
  "visual-question-answering": ChatModel,
};
