import { describe, expect, it } from "vitest";

import {
  buildVisitorSummary,
  evaluateVisibilityRule,
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

describe("buildVisitorSummary", () => {
  it("combines the name with an age-based label", () => {
    expect(buildVisitorSummary({ name: "Maya", age: "28" })).toBe(
      "Maya is an adult visitor.",
    );
    expect(buildVisitorSummary({ name: "Leo", age: "16" })).toBe(
      "Leo is a younger visitor.",
    );
  });

  it("uses friendly fallback text when the name is empty", () => {
    expect(buildVisitorSummary({ name: "", age: "20" })).toBe(
      "This visitor is an adult visitor.",
    );
  });
});
