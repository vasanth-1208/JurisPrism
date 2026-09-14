import {
  AIService,
  AnalysisResult,
  QAAnswerResult,
} from "./ai-service.interface";
import {
  ANALYSIS_PROMPT_TEMPLATE,
  sanitizeAndWrapDocumentText,
  SYSTEM_ROLE_LEGAL_INTELLIGENCE,
} from "./prompt-templates";
import { FullAnalysisOutputSchema } from "./schemas";
import { DeterministicLegalEngine } from "./deterministic-engine";
import { DocumentChunk, DocumentComparisonResult } from "@/types";

export class GeminiAIService implements AIService {
  public name = "Google Gemini GenAI (API Integrated)";
  private apiKey: string;
  private modelName: string;
  private fallbackEngine: DeterministicLegalEngine;

  constructor(apiKey: string, modelName = "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.modelName = modelName;
    this.fallbackEngine = new DeterministicLegalEngine();
  }

  public async analyzeDocument(rawText: string, documentName: string): Promise<AnalysisResult> {
    try {
      const sanitizedDoc = sanitizeAndWrapDocumentText(rawText);
      const prompt = `${ANALYSIS_PROMPT_TEMPLATE}\n\nDOCUMENT TO ANALYZE:\n${sanitizedDoc}`;

      const responseText = await this.callGeminiApi(prompt, true);
      const parsedJson = JSON.parse(responseText);
      const validated = FullAnalysisOutputSchema.parse(parsedJson);

      return {
        summary: validated.summary,
        clauses: validated.clauses,
        obligations: validated.obligations,
        decisionSteps: validated.decisionSteps,
        prepKit: validated.prepKit,
      };
    } catch (err) {
      console.warn("Gemini API call or validation failed, gracefully falling back to deterministic legal engine:", err);
      return this.fallbackEngine.analyzeDocument(rawText, documentName);
    }
  }

  public async answerQuestion(
    rawText: string,
    question: string,
    chunks: DocumentChunk[]
  ): Promise<QAAnswerResult> {
    try {
      // Find top 3 relevant chunks
      const qLower = question.toLowerCase();
      const scored = chunks.map((c) => {
        let score = 0;
        const words = qLower.split(/\s+/).filter((w) => w.length > 2);
        for (const w of words) {
          if (c.content.toLowerCase().includes(w)) score++;
        }
        return { c, score };
      }).sort((a, b) => b.score - a.score);

      const topChunks = scored.slice(0, 3).map((s) => s.c);
      const context = topChunks.map((tc, idx) => `[Chunk ${idx + 1} | ${tc.sectionTitle || `Page ${tc.pageNumber || 1}`}]:\n${tc.content}`).join("\n\n");

      const prompt = `${SYSTEM_ROLE_LEGAL_INTELLIGENCE}

You are answering a question strictly grounded in the provided document chunks.
USER QUESTION: "${question}"

DOCUMENT CHUNKS:
${sanitizeAndWrapDocumentText(context)}

CRITICAL RULES:
1. Ground your answer ONLY in the chunks provided.
2. If the answer cannot be found with certainty in the text, respond: "I couldn't find this information in the provided document."
3. Cite the exact section or page as source.
4. Return JSON:
{
  "answer": "string",
  "sources": [{"section": "string", "page": number, "quoteSnippet": "string", "relevanceScore": 0.9}],
  "confidence": "HIGH | MEDIUM | LOW",
  "isFoundInDocument": true/false
}`;

      const responseText = await this.callGeminiApi(prompt, true);
      const parsed = JSON.parse(responseText);
      return {
        answer: parsed.answer || "I couldn't find this information in the provided document.",
        sources: parsed.sources || [],
        confidence: parsed.confidence || "MEDIUM",
        isFoundInDocument: parsed.isFoundInDocument ?? true,
      };
    } catch (err) {
      console.warn("Gemini QA failed, falling back to deterministic QA engine:", err);
      return this.fallbackEngine.answerQuestion(rawText, question, chunks);
    }
  }

  public async compareDocuments(
    docAText: string,
    docBText: string,
    docAName: string,
    docBName: string,
    userId: string,
    docAId: string,
    docBId: string
  ): Promise<DocumentComparisonResult> {
    try {
      const prompt = `${SYSTEM_ROLE_LEGAL_INTELLIGENCE}

Compare the following two legal documents structurally. Highlight meaningful legal and financial differences (e.g. Added, Removed, Modified clauses, liability changes, payment changes, termination changes).

DOCUMENT A (${docAName}):
${sanitizeAndWrapDocumentText(docAText.substring(0, 8000))}

DOCUMENT B (${docBName}):
${sanitizeAndWrapDocumentText(docBText.substring(0, 8000))}

Return valid JSON conforming to:
{
  "overviewSummary": "string",
  "majorChangesCount": { "high": number, "medium": number, "low": number },
  "clauses": [
    {
      "clauseTitle": "string",
      "category": "PARTIES_AND_TERM | OBLIGATIONS | FINANCIAL_AND_PAYMENT | TERMINATION | CONFIDENTIALITY | LIABILITY_AND_INDEMNIFICATION | INTELLECTUAL_PROPERTY | DISPUTE_RESOLUTION | GOVERNING_LAW | RESTRICTIVE_COVENANTS | DATA_AND_PRIVACY | GENERAL_BOILERPLATE",
      "docAContent": "string",
      "docBContent": "string",
      "changeType": "ADDED | REMOVED | MODIFIED | UNCHANGED",
      "significance": "HIGH | MEDIUM | LOW",
      "plainEnglishImpact": "string",
      "suggestedClarification": "string"
    }
  ]
}`;

      const responseText = await this.callGeminiApi(prompt, true);
      const parsed = JSON.parse(responseText);
      return {
        id: `cmp-${Date.now()}`,
        userId,
        docAId,
        docBId,
        docAName,
        docBName,
        overviewSummary: parsed.overviewSummary,
        majorChangesCount: parsed.majorChangesCount,
        clauses: parsed.clauses,
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("Gemini compare failed, falling back to deterministic comparison:", err);
      return this.fallbackEngine.compareDocuments(docAText, docBText, docAName, docBName, userId, docAId, docBId);
    }
  }

  private async callGeminiApi(prompt: string, expectJson = true): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const body: any = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.95,
      },
    };

    if (expectJson) {
      body.generationConfig.responseMimeType = "application/json";
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No response text returned from Gemini API");
    }

    return text.trim();
  }
}
