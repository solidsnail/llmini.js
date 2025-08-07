import "highlight.js/styles/github.css";

import { AudioTextToTextComponent } from "llmini.js/categories/audio-text-to-text";
import "llmini.js/themes/basic.css";

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
