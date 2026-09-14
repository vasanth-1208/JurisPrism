import { z } from "zod";

export const AttentionLevelSchema = z.enum(["HIGH", "MEDIUM", "LOW", "INFORMATIONAL"]);

export const ClauseCategorySchema = z.enum([
  "PARTIES_AND_TERM",
  "OBLIGATIONS",
  "FINANCIAL_AND_PAYMENT",
  "TERMINATION",
  "CONFIDENTIALITY",
  "LIABILITY_AND_INDEMNIFICATION",
  "INTELLECTUAL_PROPERTY",
  "DISPUTE_RESOLUTION",
  "GOVERNING_LAW",
  "RESTRICTIVE_COVENANTS",
  "DATA_AND_PRIVACY",
  "GENERAL_BOILERPLATE",
]);

export const SummarySchema = z.object({
  documentType: z.string().default("Unknown Legal Document"),
  executiveSummary: z.string(),
  plainEnglishExplanation: z.string(),
  parties: z.object({
    partyA: z.string().default("Not found in document"),
    partyB: z.string().default("Not found in document"),
    additionalParties: z.array(z.string()).optional(),
  }),
  effectiveDate: z.string().default("Not found in document"),
  termExpiry: z.string().default("Not found in document"),
  governingLaw: z.string().default("Not found in document"),
  jurisdiction: z.string().default("Not found in document"),
  keyFinancialTerms: z.string().default("Not found in document"),
});

export const ClauseSchema = z.object({
  sectionNumber: z.string().optional().default(""),
  title: z.string(),
  originalText: z.string(),
  plainExplanation: z.string(),
  whyItMatters: z.string(),
  potentialConcern: z.string(),
  suggestedQuestion: z.string(),
  attentionLevel: AttentionLevelSchema,
  category: ClauseCategorySchema,
});

export const ObligationSchema = z.object({
  eventName: z.string(),
  deadlineRaw: z.string(),
  isRelative: z.boolean().default(false),
  requiredAction: z.string(),
  relevantClause: z.string(),
  severity: AttentionLevelSchema.default("MEDIUM"),
});

export const DecisionStepItemSchema = z.object({
  label: z.string(),
  description: z.string(),
  sourceRef: z.string().optional(),
  concernLevel: AttentionLevelSchema.optional(),
});

export const DecisionStepSchema = z.object({
  stepIndex: z.number(),
  title: z.string(),
  subtitle: z.string(),
  summary: z.string(),
  items: z.array(DecisionStepItemSchema),
  warningBanner: z.string().optional(),
});

export const PrepKitSchema = z.object({
  aboutDocument: z.string(),
  whatIAmAgreeingTo: z.array(z.string()),
  myKeyObligations: z.array(
    z.object({
      obligation: z.string(),
      deadline: z.string(),
      clause: z.string(),
    })
  ),
  importantDatesAndDeadlines: z.array(
    z.object({
      event: z.string(),
      deadline: z.string(),
      action: z.string(),
    })
  ),
  highPriorityReviewAreas: z.array(
    z.object({
      issue: z.string(),
      potentialImpact: z.string(),
      clauseRef: z.string(),
    })
  ),
  questionsForMyLawyer: z.array(
    z.object({
      priority: z.enum(["HIGH", "MEDIUM"]),
      question: z.string(),
      reason: z.string(),
    })
  ),
  documentsAndInfoToGather: z.array(z.string()),
  preSigningNegotiationPoints: z.array(z.string()),
});

export const FullAnalysisOutputSchema = z.object({
  summary: SummarySchema,
  clauses: z.array(ClauseSchema),
  obligations: z.array(ObligationSchema),
  decisionSteps: z.array(DecisionStepSchema),
  prepKit: PrepKitSchema,
});
