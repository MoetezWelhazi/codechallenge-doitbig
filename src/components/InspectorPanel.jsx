export default function InspectorPanel({
  segments,
  visibilityRule,
  onVisibilityRuleChange,
}) {
  function updateVisibilityRule(nextFields) {
    onVisibilityRuleChange({
      ...visibilityRule,
      ...nextFields,
    });
  }

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

      <fieldset className="rule-card">
        <legend>Show when</legend>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={visibilityRule.enabled}
            onChange={(event) =>
              updateVisibilityRule({ enabled: event.target.checked })
            }
          />
          Only show this text for some visitors
        </label>

        {visibilityRule.enabled ? (
          <div className="rule-row" aria-label="Show when rule">
            <span>Age</span>
            <span>is at least</span>
            <input
              aria-label="Minimum age"
              type="number"
              min="0"
              value={visibilityRule.value}
              onChange={(event) =>
                updateVisibilityRule({ value: event.target.value })
              }
            />
          </div>
        ) : null}
      </fieldset>
    </aside>
  );
}
