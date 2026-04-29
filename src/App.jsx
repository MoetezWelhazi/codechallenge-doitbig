import { useState } from "react";

import CanvasPreview from "./components/CanvasPreview";
import InspectorPanel from "./components/InspectorPanel";
import { renderSmartText } from "./lib/smartText";

const initialSegments = [
  { type: "text", value: "Hello, " },
  { type: "field", field: "name", label: "Name" },
  { type: "text", value: ". You are " },
  { type: "field", field: "age", label: "Age" },
  { type: "text", value: " years old." },
];

export default function App() {
  const [answers, setAnswers] = useState({ name: "Maya", age: "28" });
  const message = renderSmartText(initialSegments, answers);

  function updateAnswer(field, value) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [field]: value,
    }));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">No-code data prototype</p>
        <h1>Design smart text without code</h1>
      </header>

      <div className="workspace" aria-label="Prototype workspace">
        <CanvasPreview
          answers={answers}
          message={message}
          onAnswerChange={updateAnswer}
        />
        <InspectorPanel segments={initialSegments} />
      </div>
    </div>
  );
}
