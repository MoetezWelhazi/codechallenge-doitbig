export default function InspectorPanel({ segments }) {
  return (
    <aside className="inspector-panel" aria-labelledby="inspector-title">
      <div className="panel-heading">
        <p className="eyebrow">Editor</p>
        <h2 id="inspector-title">Text settings</h2>
      </div>

      <div className="field">
        <span>Smart text</span>
        <div className="segment-list" aria-label="Smart text recipe">
          {segments.map((segment, index) =>
            segment.type === "field" ? (
              <span className="data-chip" key={`${segment.field}-${index}`}>
                {segment.label}
              </span>
            ) : (
              <span key={`${segment.value}-${index}`}>{segment.value}</span>
            ),
          )}
        </div>
      </div>

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
