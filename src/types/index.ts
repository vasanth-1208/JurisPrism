export type Role = "user" | "admin" | "demo";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export type DocumentStatus = "PENDING" | "PROCESSING" | "ANALYZED" | "ERROR";

export type AttentionLevel = "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";

export type ClauseCategory = 
  | "PARTIES_AND_TERM"
  | "OBLIGATIONS"
  | "FINANCIAL_AND_PAYMENT"
  | "TERMINATION"
  | "CONFIDENTIALITY"
  | "LIABILITY_AND_INDEMNIFICATION"
  | "INTELLECTUAL_PROPERTY"
  | "DISPUTE_RESOLUTION"
  | "GOVERNING_LAW"
  | "RESTRICTIVE_COVENANTS"
  | "DATA_AND_PRIVACY"
  | "GENERAL_BOILERPLATE";

export interface DocumentMetadata {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  sha256Hash: string;
  documentType: string;
  status: DocumentStatus;
  statusMessage?: string;
  pageCount: number;
  rawText: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  sectionTitle?: string;
  pageNumber?: number;
}

export interface ClauseAnalysis {
  id: string;
  documentId: string;
  sectionNumber?: string;
  title: string;
  originalText: string;
  plainExplanation: string;
  whyItMatters: string;
  potentialConcern: string;
  suggestedQuestion: string;
  attentionLevel: AttentionLevel;
  category: ClauseCategory;
  isMissingOrSilent?: boolean;
}

export interface ObligationItem {
  id: string;
  documentId: string;
  eventName: string;
  deadlineRaw: string;
  isRelative: boolean;
  requiredAction: string;
  relevantClause: string;
  severity: AttentionLevel;
  dueDateEstimated?: string;
}

export interface DocumentAnalysisSummary {
  id: string;
  documentId: string;
  documentType: string;
  executiveSummary: string;
  plainEnglishExplanation: string;
  parties: {
    partyA: string;
    partyB: string;
    additionalParties?: string[];
  };
  effectiveDate: string;
  termExpiry: string;
  governingLaw: string;
  jurisdiction: string;
  keyFinancialTerms: string;
  createdAt: string;
}

export interface GroundedQASource {
  section: string;
  page?: number;
  quoteSnippet: string;
  relevanceScore?: number;
}

export interface QAInteraction {
  id: string;
  documentId: string;
  userId: string;
  question: string;
  answer: string;
  sources: GroundedQASource[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  isFoundInDocument: boolean;
  createdAt: string;
}

export interface ClauseComparison {
  clauseTitle: string;
  category: ClauseCategory;
  docAContent: string;
  docBContent: string;
  changeType: "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED";
  significance: "HIGH" | "MEDIUM" | "LOW";
  plainEnglishImpact: string;
  suggestedClarification: string;
}

export interface DocumentComparisonResult {
  id: string;
  userId: string;
  docAId: string;
  docBId: string;
  docAName: string;
  docBName: string;
  overviewSummary: string;
  majorChangesCount: {
    high: number;
    medium: number;
    low: number;
  };
  clauses: ClauseComparison[];
  createdAt: string;
}

export interface DecisionNavigatorStep {
  stepIndex: number;
  title: string;
  subtitle: string;
  summary: string;
  items: {
    label: string;
    description: string;
    sourceRef?: string;
    concernLevel?: AttentionLevel;
  }[];
  warningBanner?: string;
}

export interface PreparationKitSections {
  aboutDocument: string;
  whatIAmAgreeingTo: string[];
  myKeyObligations: { obligation: string; deadline: string; clause: string }[];
  importantDatesAndDeadlines: { event: string; deadline: string; action: string }[];
  highPriorityReviewAreas: { issue: string; potentialImpact: string; clauseRef: string }[];
  questionsForMyLawyer: { priority: "HIGH" | "MEDIUM"; question: string; reason: string }[];
  documentsAndInfoToGather: string[];
  preSigningNegotiationPoints: string[];
}

export interface PreparationKit {
  id: string;
  documentId: string;
  userId: string;
  documentTitle: string;
  generatedAt: string;
  sections: PreparationKitSections;
}

export interface FullDocumentAnalysis {
  document: DocumentMetadata;
  summary: DocumentAnalysisSummary;
  clauses: ClauseAnalysis[];
  obligations: ObligationItem[];
  decisionSteps: DecisionNavigatorStep[];
  prepKit: PreparationKit;
}
