import { describe, expect, it } from "vitest";

import {
  evaluateVisibilityRule,
  getAgeGroup,
  renderSmartText,
} from "./smartText";

describe("renderSmartText", () => {
  it("renders text and field segments as one readable sentence", () => {
    const segments = [
      { type: "text", value: "Hello, " },
      { type: "field", field: "name", label: "Name" },
      { type: "text", value: "." },
    ];

    expect(renderSmartText(segments, { name: "Maya" })).toBe("Hello, Maya.");
  });

  it("uses a friendly placeholder when a field has no answer yet", () => {
    const segments = [
      { type: "text", value: "Hello, " },
      { type: "field", field: "name", label: "Name" },
    ];

    expect(renderSmartText(segments, { name: "" })).toBe("Hello, your answer");
  });
});

describe("evaluateVisibilityRule", () => {
  it("shows content when the rule is disabled", () => {
    expect(evaluateVisibilityRule({ enabled: false }, {})).toBe(true);
  });

  it("evaluates plain-language number comparisons", () => {
    const rule = {
      enabled: true,
      field: "age",
      operator: "gte",
      value: 18,
    };

    expect(evaluateVisibilityRule(rule, { age: "21" })).toBe(true);
    expect(evaluateVisibilityRule(rule, { age: "16" })).toBe(false);
  });

  it("evaluates text presence and matching rules", () => {
    expect(
      evaluateVisibilityRule(
        { enabled: true, field: "name", operator: "notEmpty" },
        { name: "Sam" },
      ),
    ).toBe(true);
    expect(
      evaluateVisibilityRule(
        { enabled: true, field: "name", operator: "contains", value: "sa" },
        { name: "Sam" },
      ),
    ).toBe(true);
  });
});

describe("getAgeGroup", () => {
  it("turns age into a friendly label", () => {
    expect(getAgeGroup("28")).toBe("adult visitor");
    expect(getAgeGroup("16")).toBe("younger visitor");
  });
});
