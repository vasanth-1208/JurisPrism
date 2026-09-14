import {
  DocumentAnalysisSummary,
  ClauseAnalysis,
  ObligationItem,
  DecisionNavigatorStep,
  PreparationKit,
  PreparationKitSections,
  QAInteraction,
  DocumentComparisonResult,
  DocumentChunk,
} from "@/types";

export interface AnalysisResult {
  summary: Omit<DocumentAnalysisSummary, "id" | "documentId" | "createdAt">;
  clauses: Omit<ClauseAnalysis, "id" | "documentId">[];
  obligations: Omit<ObligationItem, "id" | "documentId">[];
  decisionSteps: DecisionNavigatorStep[];
  prepKit: PreparationKitSections;
}

export interface QAAnswerResult {
  answer: string;
  sources: { section: string; page?: number; quoteSnippet: string; relevanceScore?: number }[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  isFoundInDocument: boolean;
}

export interface AIService {
  name: string;
  analyzeDocument(rawText: string, documentName: string): Promise<AnalysisResult>;
  answerQuestion(
    rawText: string,
    question: string,
    chunks: DocumentChunk[]
  ): Promise<QAAnswerResult>;
  compareDocuments(
    docAText: string,
    docBText: string,
    docAName: string,
    docBName: string,
    userId: string,
    docAId: string,
    docBId: string
  ): Promise<DocumentComparisonResult>;
}
