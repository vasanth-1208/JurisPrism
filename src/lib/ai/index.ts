import { AIService } from "./ai-service.interface";
import { DeterministicLegalEngine } from "./deterministic-engine";
import { GeminiAIService } from "./gemini-service";

let cachedAIService: AIService | null = null;

export function getAIService(): AIService {
  if (cachedAIService) {
    return cachedAIService;
  }

  const provider = (process.env.AI_PROVIDER || "auto").toLowerCase();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if ((provider === "auto" || provider === "gemini") && geminiKey) {
    cachedAIService = new GeminiAIService(geminiKey, process.env.GEMINI_MODEL || "gemini-1.5-flash");
  } else {
    cachedAIService = new DeterministicLegalEngine();
  }

  return cachedAIService;
}

export function getAIServiceInfo(): {
  providerName: string;
  isOfflineMode: boolean;
  hasGeminiKey: boolean;
} {
  const service = getAIService();
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY?.trim());
  const isOfflineMode = service instanceof DeterministicLegalEngine;

  return {
    providerName: service.name,
    isOfflineMode,
    hasGeminiKey,
  };
}
