export default function CanvasPreview({
  answers,
  isMessageVisible,
  message,
  onAnswerChange,
  visitorSummary,
}) {
  return (
    <main className="preview-panel" aria-labelledby="preview-title">
      <div className="panel-heading">
        <p className="eyebrow">Live preview</p>
        <h2 id="preview-title">Visitor form</h2>
      </div>

      <section className="preview-card" aria-label="Preview app">
        <label className="field">
          Name
          <input
            type="text"
            value={answers.name}
            onChange={(event) => onAnswerChange("name", event.target.value)}
            placeholder="Enter name"
          />
        </label>

        <label className="field">
          Age
          <input
            type="number"
            value={answers.age}
            onChange={(event) => onAnswerChange("age", event.target.value)}
            placeholder="Enter age"
            min="0"
          />
        </label>

        <div className="message-card">
          <p className="message-label">Text element</p>
          {isMessageVisible ? (
            <p className="message-preview">{message}</p>
          ) : (
            <p className="hidden-message">This text is hidden right now.</p>
          )}
        </div>

        <div className="summary-card">
          <p className="message-label">Combined answer</p>
          <p>{visitorSummary}</p>
        </div>
      </section>
    </main>
  );
}
