const EMPTY_FIELD_TEXT = "your answer";

export function renderSmartText(segments, values) {
  return segments
    .map((segment) => {
      if (segment.type === "text") {
        return segment.value;
      }

      if (segment.type === "field") {
        const value = values[segment.field];
        return hasValue(value) ? String(value).trim() : EMPTY_FIELD_TEXT;
      }

      return "";
    })
    .join("");
}

export function evaluateVisibilityRule(rule, values) {
  if (!rule?.enabled) {
    return true;
  }

  const fieldValue = values[rule.field];

  switch (rule.operator) {
    case "notEmpty":
      return hasValue(fieldValue);
    case "equals":
      return normalize(fieldValue) === normalize(rule.value);
    case "contains":
      return normalize(fieldValue).includes(normalize(rule.value));
    case "gte":
      return toNumber(fieldValue) >= toNumber(rule.value);
    case "lte":
      return toNumber(fieldValue) <= toNumber(rule.value);
    default:
      return true;
  }
}

export function buildVisitorSummary(values) {
  const name = hasValue(values.name) ? String(values.name).trim() : "This visitor";
  const isAdult = toNumber(values.age) >= 18;
  const article = isAdult ? "an" : "a";
  const ageLabel = isAdult ? "adult visitor" : "younger visitor";

  return `${name} is ${article} ${ageLabel}.`;
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function normalize(value) {
  return hasValue(value) ? String(value).trim().toLowerCase() : "";
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}
