import { describe, it, expect } from "vitest";
import { DeterministicLegalEngine } from "@/lib/ai/deterministic-engine";
import { DEMO_CONTRACTS } from "@/lib/demo/contracts";

describe("Structural Document Comparison Tests", () => {
  const engine = new DeterministicLegalEngine();

  const docA = DEMO_CONTRACTS.find((c) => c.id === "demo-employment-agreement")!;
  const docB = DEMO_CONTRACTS.find((c) => c.id === "demo-employment-redline")!;

  it("identifies structural changes between base agreement and counter-draft redline", async () => {
    const comparison = await engine.compareDocuments(
      docA.rawText,
      docB.rawText,
      docA.title,
      docB.title,
      "usr-test",
      "doc-a",
      "doc-b"
    );

    expect(comparison.clauses.length).toBeGreaterThanOrEqual(3);

    // 1. Should identify Non-compete removal as HIGH significance
    const nonCompeteDiff = comparison.clauses.find((c) => c.clauseTitle.includes("Non-Competition"));
    expect(nonCompeteDiff).toBeDefined();
    expect(nonCompeteDiff?.changeType).toBe("REMOVED");
    expect(nonCompeteDiff?.significance).toBe("HIGH");

    // 2. Should identify Severance change
    const severanceDiff = comparison.clauses.find((c) => c.clauseTitle.includes("Severance"));
    expect(severanceDiff).toBeDefined();
    expect(severanceDiff?.changeType).toBe("MODIFIED");
    expect(severanceDiff?.significance).toBe("HIGH");

    // 3. Should identify Salary increase
    const salaryDiff = comparison.clauses.find((c) => c.clauseTitle.includes("Salary"));
    expect(salaryDiff).toBeDefined();
    expect(salaryDiff?.changeType).toBe("MODIFIED");

    // Check count aggregations
    expect(comparison.majorChangesCount.high).toBeGreaterThanOrEqual(2);
  });
});
