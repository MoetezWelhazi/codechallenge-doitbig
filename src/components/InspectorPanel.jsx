export default function InspectorPanel({ message, onMessageChange }) {
  return (
    <aside className="inspector-panel" aria-labelledby="inspector-title">
      <div className="panel-heading">
        <p className="eyebrow">Editor</p>
        <h2 id="inspector-title">Text settings</h2>
      </div>

      <label className="field">
        Message
        <textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Write the text visitors should see"
          rows={5}
        />
      </label>

      <div className="helper-card">
        <h3>Next up</h3>
        <p>
          This editor will use friendly chips for answers like name and age,
          without asking users to write code.
        </p>
      </div>
    </aside>
  );
}
