import { useState } from "react";

import CanvasPreview from "./components/CanvasPreview";
import InspectorPanel from "./components/InspectorPanel";
import {
  evaluateVisibilityRule,
  getAgeGroup,
  renderSmartText,
} from "./lib/smartText";

const initialFields = [
  { id: "name", label: "Name", type: "text" },
  { id: "age", label: "Age", type: "number" },
  {
    id: "ageGroup",
    label: "Age group",
    type: "derived",
    description: "Adult or younger, based on Age",
  },
];

const initialSegments = [
  { id: "segment-1", type: "text", value: "Hello, " },
  { id: "segment-2", type: "field", field: "name" },
  { id: "segment-3", type: "text", value: ". You are " },
  { id: "segment-4", type: "field", field: "age" },
  { id: "segment-5", type: "text", value: " years old. Visitor type: " },
  { id: "segment-6", type: "field", field: "ageGroup" },
  { id: "segment-7", type: "text", value: "." },
];

/**
 * Owns the prototype's serializable state and wires the editor to the preview.
 *
 * The app keeps fields, smart-text segments, answers, and the visibility rule in
 * plain React state so the data model stays easy to inspect, test, and explain.
 * `composerVersion` is intentionally separate: the contentEditable composer
 * updates itself while typing, and only needs a forced rebuild when external
 * controls append chips or rename fields.
 */
export default function App() {
  const [fields, setFields] = useState(initialFields);
  const [segments, setSegments] = useState(initialSegments);
  const [nextSegmentNumber, setNextSegmentNumber] = useState(8);
  const [composerVersion, setComposerVersion] = useState(0);
  const [answers, setAnswers] = useState({ name: "Maya", age: "28" });
  const [visibilityRule, setVisibilityRule] = useState({
    enabled: true,
    field: "age",
    operator: "gte",
    value: 18,
  });

  const smartValues = {
    ...answers,
    ageGroup: getAgeGroup(answers.age),
  };
  const message = renderSmartText(segments, smartValues);
  const isMessageVisible = evaluateVisibilityRule(visibilityRule, smartValues);

  function bumpComposerVersion() {
    setComposerVersion((current) => current + 1);
  }

  function addFieldSegment(fieldId) {
    setSegments((currentSegments) => [
      ...currentSegments,
      { id: `segment-${nextSegmentNumber}`, type: "field", field: fieldId },
    ]);
    setNextSegmentNumber((current) => current + 1);
    bumpComposerVersion();
  }

  function updateFieldLabel(fieldId, label) {
    setFields((currentFields) =>
      currentFields.map((field) =>
        field.id === fieldId ? { ...field, label } : field,
      ),
    );
    bumpComposerVersion();
  }

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
          fields={fields}
          isMessageVisible={isMessageVisible}
          message={message}
          onAnswerChange={updateAnswer}
        />
        <InspectorPanel
          fields={fields}
          segments={segments}
          composerVersion={composerVersion}
          visibilityRule={visibilityRule}
          onAddFieldSegment={addFieldSegment}
          onFieldLabelChange={updateFieldLabel}
          onSegmentsChange={setSegments}
          onVisibilityRuleChange={setVisibilityRule}
        />
      </div>
    </div>
  );
}
