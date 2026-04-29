import SmartTextComposer from "./SmartTextComposer";
import { beginShelfDrag } from "./smartTextDrag";

const sharedComparisonOptions = [{ value: "notEmpty", label: "is not empty" }];
const textComparisonOptions = [
  ...sharedComparisonOptions,
  { value: "equals", label: "is exactly" },
  { value: "contains", label: "includes" },
];
const numberComparisonOptions = [
  ...sharedComparisonOptions,
  { value: "equals", label: "is exactly" },
  { value: "gte", label: "is at least" },
  { value: "lte", label: "is at most" },
];

/**
 * Provides the non-technical controls for composing smart text and conditions.
 *
 * The panel keeps the UI vocabulary close to how a user would describe the
 * behavior: write text, drag answer chips, and define when the text should
 * appear. Comparison options are filtered by answer type so the user cannot
 * choose a rule that does not make sense for the selected field.
 */
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
  const selectedField = editableFields.find(
    (field) => field.id === visibilityRule.field,
  );
  const comparisonOptions = getComparisonOptions(selectedField);

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
        <legend>When should this text appear?</legend>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={visibilityRule.enabled}
            onChange={(event) =>
              updateVisibilityRule({ enabled: event.target.checked })
            }
          />
          Only show when an answer matches a condition
        </label>

        {visibilityRule.enabled ? (
          <div className="rule-row" aria-label="Show when rule">
            <span>Show this text when</span>
            <select
              aria-label="Answer to check"
              value={visibilityRule.field}
              onChange={(event) =>
                updateVisibilityRule({
                  field: event.target.value,
                  operator: getNextOperator(
                    editableFields.find(
                      (field) => field.id === event.target.value,
                    ),
                    visibilityRule.operator,
                  ).value,
                })
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
              {comparisonOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
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

/**
 * Returns the comparison phrases that are valid for the selected answer type.
 * This keeps text answers from offering numeric-only comparisons like
 * "is at least", while preserving the small rule object used by the evaluator.
 */
function getComparisonOptions(field) {
  return field?.type === "number" ? numberComparisonOptions : textComparisonOptions;
}

/**
 * Keeps the current operator when switching fields, unless that operator no
 * longer belongs to the new field type.
 */
function getNextOperator(field, currentOperator) {
  const options = getComparisonOptions(field);
  const currentOption = options.find((option) => option.value === currentOperator);
  return currentOption ?? options[0];
}
