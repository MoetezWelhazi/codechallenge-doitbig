import SmartTextComposer from "./SmartTextComposer";
import { beginShelfDrag } from "./smartTextDrag";

export default function InspectorPanel({
  fields,
  segments,
  composerVersion,
  visibilityRule,
  onAddFieldSegment,
  onFieldLabelChange,
  onSegmentsChange,
  onVisibilityRuleChange,
}) {
  const editableFields = fields.filter((field) => field.type !== "derived");

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
        <div className="chip-shelf" aria-label="Answer chips">
          {fields.map((field) => (
            <button
              type="button"
              className="shelf-chip"
              draggable
              key={field.id}
              onDragStart={(event) => beginShelfDrag(event, field.id)}
              onClick={() => onAddFieldSegment(field.id)}
            >
              {field.label}
            </button>
          ))}
        </div>

        <p className="composer-help">
          Type freely. Drag a chip from above into the text, or drag an
          existing chip to move it.
        </p>

        <SmartTextComposer
          fields={fields}
          segments={segments}
          version={composerVersion}
          onSegmentsChange={onSegmentsChange}
        />
      </div>

      <fieldset className="rule-card">
        <legend>Form fields</legend>
        {editableFields.map((field) => (
          <label className="field" key={field.id}>
            Label for {field.id}
            <input
              type="text"
              value={field.label}
              onChange={(event) =>
                onFieldLabelChange(field.id, event.target.value)
              }
            />
          </label>
        ))}
      </fieldset>

      <fieldset className="rule-card">
        <legend>When should this text show?</legend>

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
            <span>Show when</span>
            <select
              aria-label="Answer to check"
              value={visibilityRule.field}
              onChange={(event) =>
                updateVisibilityRule({ field: event.target.value })
              }
            >
              {editableFields.map((field) => (
                <option value={field.id} key={field.id}>
                  {field.label}
                </option>
              ))}
            </select>
            <select
              aria-label="How to compare"
              value={visibilityRule.operator}
              onChange={(event) =>
                updateVisibilityRule({ operator: event.target.value })
              }
            >
              <option value="notEmpty">has an answer</option>
              <option value="equals">is exactly</option>
              <option value="contains">includes</option>
              <option value="gte">is at least</option>
              <option value="lte">is at most</option>
            </select>
            {visibilityRule.operator === "notEmpty" ? null : (
              <input
                aria-label="Comparison answer"
                type={
                  fields.find((field) => field.id === visibilityRule.field)
                    ?.type === "number"
                    ? "number"
                    : "text"
                }
                min="0"
                value={visibilityRule.value}
                onChange={(event) =>
                  updateVisibilityRule({ value: event.target.value })
                }
              />
            )}
          </div>
        ) : null}
      </fieldset>
    </aside>
  );
}
