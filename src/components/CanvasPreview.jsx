export default function CanvasPreview({
  answers,
  fields,
  isMessageVisible,
  message,
  onAnswerChange,
}) {
  const editableFields = fields.filter((field) => field.type !== "derived");

  return (
    <main className="preview-panel" aria-labelledby="preview-title">
      <div className="panel-heading">
        <p className="eyebrow">Live preview</p>
        <h2 id="preview-title">Visitor form</h2>
      </div>

      <section className="preview-card" aria-label="Preview app">
        {editableFields.map((field) => (
          <label className="field" key={field.id}>
            {field.label}
            <input
              type={field.type}
              value={answers[field.id]}
              onChange={(event) => onAnswerChange(field.id, event.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              min={field.type === "number" ? "0" : undefined}
            />
          </label>
        ))}

        <div className="message-card">
          <p className="message-label">Text element</p>
          {isMessageVisible ? (
            <p className="message-preview">{message}</p>
          ) : (
            <p className="hidden-message">This text is hidden right now.</p>
          )}
        </div>
      </section>
    </main>
  );
}
