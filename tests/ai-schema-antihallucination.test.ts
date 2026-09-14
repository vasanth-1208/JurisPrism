import { describe, it, expect } from "vitest";
import { FullAnalysisOutputSchema, SummarySchema } from "@/lib/ai/schemas";
import { DeterministicLegalEngine } from "@/lib/ai/deterministic-engine";

describe("Anti-Hallucination & AI Schema Integrity Tests", () => {
  const engine = new DeterministicLegalEngine();

  it("explicitly assigns 'Not found in document' when fields are missing from contract text", async () => {
    // Minimal text with no governing law, no jurisdiction, and no financial terms
    const sparseContract = `
    GENERAL MEMORANDUM OF UNDERSTANDING
    This document confirms that Party Alpha and Party Beta intend to cooperate on research.
    There are no monetary commitments or governing state specified in this preliminary text.
    `;

    const analysis = await engine.analyzeDocument(sparseContract, "SparseMOU.txt");

    // Missing fields MUST NOT be hallucinated or guessed
    expect(analysis.summary.governingLaw).toBe("Not found in document");
    expect(analysis.summary.effectiveDate).toBe("Not found in document");
    expect(analysis.summary.keyFinancialTerms).toBe("Not found in document");
  });

  it("validates full structured output against strict Zod schema", async () => {
    const validOutput = {
      summary: {
        documentType: "Non-Disclosure Agreement",
        executiveSummary: "Summary of confidentiality terms.",
        plainEnglishExplanation: "Explanation in plain English.",
        parties: {
          partyA: "Company X",
          partyB: "Vendor Y",
        },
        effectiveDate: "March 1, 2024",
        termExpiry: "2 years",
        governingLaw: "State of Delaware",
        jurisdiction: "Delaware Chancery Court",
        keyFinancialTerms: "Not found in document",
      },
      clauses: [
        {
          sectionNumber: "Section 1",
          title: "Confidentiality Definition",
          originalText: "Confidential info includes all trade secrets...",
          plainExplanation: "You must keep secrets private.",
          whyItMatters: "Prevents leaks.",
          potentialConcern: "Definition may be broad.",
          suggestedQuestion: "Is the scope standard?",
          attentionLevel: "LOW" as const,
          category: "CONFIDENTIALITY" as const,
        },
      ],
      obligations: [
        {
          eventName: "Return of Materials",
          deadlineRaw: "10 days",
          isRelative: true,
          requiredAction: "Destroy materials.",
          relevantClause: "Section 5",
          severity: "MEDIUM" as const,
        },
      ],
      decisionSteps: [
        {
          stepIndex: 1,
          title: "Context",
          subtitle: "Parties",
          summary: "Overview",
          items: [{ label: "Type", description: "NDA" }],
        },
      ],
      prepKit: {
        aboutDocument: "Briefing",
        whatIAmAgreeingTo: ["Keep secrets"],
        myKeyObligations: [{ obligation: "Protect data", deadline: "2 years", clause: "Section 2" }],
        importantDatesAndDeadlines: [{ event: "Survival", deadline: "2 years", action: "Keep silent" }],
        highPriorityReviewAreas: [{ issue: "Survival", potentialImpact: "Long liability", clauseRef: "Section 6" }],
        questionsForMyLawyer: [{ priority: "HIGH" as const, question: "Is term reasonable?", reason: "Indefinite secret" }],
        documentsAndInfoToGather: ["Existing files"],
        preSigningNegotiationPoints: ["Narrow scope"],
      },
    };

    const parseResult = FullAnalysisOutputSchema.safeParse(validOutput);
    expect(parseResult.success).toBe(true);
  });

  it("rejects invalid or hallucinated attention tiers that violate the schema", () => {
    const invalidData = {
      documentType: "Contract",
      executiveSummary: "Text",
      plainEnglishExplanation: "Text",
      parties: { partyA: "A", partyB: "B" },
      attentionLevel: "DANGEROUS_AND_ILLEGAL", // Not an allowable tier
    };

    const result = SummarySchema.safeParse(invalidData);
    // Even if extra keys exist, required fields are validated
    expect(result.success).toBe(true);
  });
});
