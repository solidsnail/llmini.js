import "highlight.js/styles/github.css";
// import "llmini.js/themes/basic.css";
// import { ObjectDetectionComponent } from "llmini.js/categories/object-detection";

import "../lib/themes/basic.css";
import { AudioTextToTextComponent } from "../lib/categories/audio-text-to-text";

function App() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <AudioTextToTextComponent
        modelName="Voxtral-Mini-3B-2507-ONNX"
        width="600px"
      />
    </div>
  );
}

export default App;
