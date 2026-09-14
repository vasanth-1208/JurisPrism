import { describe, it, expect } from "vitest";
import { DeterministicLegalEngine } from "@/lib/ai/deterministic-engine";
import { DocumentChunk } from "@/types";

describe("Grounded Legal Document Q&A Tests", () => {
  const engine = new DeterministicLegalEngine();

  const mockChunks: DocumentChunk[] = [
    {
      id: "chk-1",
      documentId: "doc-sample-1",
      chunkIndex: 0,
      content: "SECTION 3.2: NOTICE REQUIREMENT. The Employee agrees to provide thirty (30) calendar days advance written notice to the Company prior to any voluntary resignation.",
      sectionTitle: "Section 3.2 (Notice Requirement)",
      pageNumber: 2,
    },
    {
      id: "chk-2",
      documentId: "doc-sample-1",
      chunkIndex: 1,
      content: "SECTION 2.1: BASE SALARY. The Company shall pay the Employee an annualized base salary of $185,000 payable in semi-monthly installments.",
      sectionTitle: "Section 2.1 (Base Salary)",
      pageNumber: 1,
    },
  ];

  it("answers a grounded question with verified source references and exact section citation", async () => {
    const question = "How much advance notice is required before resignation?";
    const response = await engine.answerQuestion("full text", question, mockChunks);

    expect(response.isFoundInDocument).toBe(true);
    expect(response.answer).toContain("Section 3.2");
    expect(response.answer).toContain("thirty (30) calendar days");
    expect(response.sources.length).toBeGreaterThan(0);
    expect(response.sources[0].section).toBe("Section 3.2 (Notice Requirement)");
    expect(response.sources[0].page).toBe(2);
  });

  it("returns explicit ungrounded fallback when the requested information is absent from document", async () => {
    const question = "Does this agreement mention pet insurance or company helicopter usage?";
    const response = await engine.answerQuestion("full text", question, mockChunks);

    expect(response.isFoundInDocument).toBe(false);
    expect(response.answer).toBe("I couldn't find this information in the provided document. The document text does not appear to explicitly address this inquiry.");
    expect(response.sources.length).toBe(0);
  });
});
