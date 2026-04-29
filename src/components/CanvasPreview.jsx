export default function CanvasPreview({ answers, message, onAnswerChange }) {
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
          <p className="message-preview">{message}</p>
        </div>
      </section>
    </main>
  );
}
