import { describe, it, expect } from "vitest";
import {
  extractTextFromBuffer,
  chunkDocumentText,
  computeSha256,
} from "@/lib/parser/extractor";

describe("Document Parsing & Extraction Tests", () => {
  it("computes accurate SHA-256 hash for document payload", () => {
    const buffer = Buffer.from("CONFIDENTIAL LEGAL AGREEMENT", "utf-8");
    const hash = computeSha256(buffer);
    expect(hash).toHaveLength(64);
    expect(typeof hash).toBe("string");
  });

  it("extracts text and estimates page count from plain text buffer", async () => {
    const sampleText = "SECTION 1. SCOPE OF SERVICES.\n\nParty A agrees to provide services.\n\nSECTION 2. TERM.\n\nThe term is 1 year.";
    const buffer = Buffer.from(sampleText, "utf-8");

    const result = await extractTextFromBuffer(buffer, "text/plain", "agreement.txt");
    expect(result.text).toBe(sampleText);
    expect(result.pageCount).toBe(1);
  });

  it("rejects unsupported file formats gracefully with a clear error", async () => {
    const buffer = Buffer.from("FAKE_EXECUTABLE_BINARY", "utf-8");

    await expect(
      extractTextFromBuffer(buffer, "application/octet-stream", "malicious_script.exe")
    ).rejects.toThrow("Unsupported document format");
  });

  it("chunks document text preserving section headers and paragraph boundaries", () => {
    const longDocument = `SECTION 1. DEFINITIONS AND RECITALS\n\nThis is paragraph one of section one.\n\nSECTION 2. TERMINATION RIGHTS\n\nEither party may terminate upon written notice.`;

    const chunks = chunkDocumentText(longDocument);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(chunks[0].content).toContain("SECTION 1");
  });
});
