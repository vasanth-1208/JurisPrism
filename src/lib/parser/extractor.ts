import crypto from "crypto";
import mammoth from "mammoth";
import { DocumentChunk } from "@/types";

export interface ParsedDocument {
  text: string;
  pageCount: number;
  sha256Hash: string;
  chunks: Omit<DocumentChunk, "documentId">[];
}

export function computeSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  originalFilename: string
): Promise<{ text: string; pageCount: number }> {
  const ext = originalFilename.toLowerCase().split(".").pop();

  // 1. TXT Files
  if (mimeType.includes("text/plain") || ext === "txt") {
    const text = buffer.toString("utf-8");
    // Approximate page count: 3000 chars per standard page
    const pageCount = Math.max(1, Math.ceil(text.length / 3000));
    return { text, pageCount };
  }

  // 2. DOCX Files
  if (
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("msword") ||
    ext === "docx"
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();
      const pageCount = Math.max(1, Math.ceil(text.length / 3000));
      return { text, pageCount };
    } catch (docxErr: any) {
      throw new Error(`Failed to extract text from DOCX file: ${docxErr.message}`);
    }
  }

  // 3. PDF Files
  if (mimeType.includes("pdf") || ext === "pdf") {
    try {
      // Dynamic require for pdf-parse to prevent bundling issues
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      const text = pdfData.text.trim();
      const pageCount = pdfData.numpages || Math.max(1, Math.ceil(text.length / 3000));
      return { text, pageCount };
    } catch (pdfErr: any) {
      throw new Error(`Failed to extract text from PDF document: ${pdfErr.message}`);
    }
  }

  throw new Error(`Unsupported document format: ${mimeType || ext}. Please upload a PDF, DOCX, or TXT file.`);
}

export function chunkDocumentText(rawText: string): Omit<DocumentChunk, "documentId">[] {
  const paragraphs = rawText.split(/\n\s*\n/);
  const chunks: Omit<DocumentChunk, "documentId">[] = [];
  let currentChunk = "";
  let chunkIdx = 0;
  let estimatedPage = 1;
  let charCountOnPage = 0;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Detect section titles (e.g., "1. POSITION AND DUTIES", "SECTION 4: TERMINATION", "Article II")
    const isSectionHeader = /^(SECTION\s+\d+|ARTICLE\s+[IVXLCDM\d]+|\d+(\.\d+)*\s+[A-Z\s]{3,})/i.test(trimmed);

    if (currentChunk.length + trimmed.length > 1800 && currentChunk.length > 0) {
      chunks.push({
        id: `chk-${chunkIdx}-${Date.now()}`,
        chunkIndex: chunkIdx++,
        content: currentChunk.trim(),
        pageNumber: estimatedPage,
      });
      currentChunk = "";
    }

    if (isSectionHeader && currentChunk.length > 600) {
      chunks.push({
        id: `chk-${chunkIdx}-${Date.now()}`,
        chunkIndex: chunkIdx++,
        content: currentChunk.trim(),
        sectionTitle: trimmed.substring(0, 80),
        pageNumber: estimatedPage,
      });
      currentChunk = trimmed + "\n\n";
    } else {
      currentChunk += trimmed + "\n\n";
    }

    charCountOnPage += trimmed.length;
    if (charCountOnPage > 3000) {
      estimatedPage++;
      charCountOnPage = 0;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `chk-${chunkIdx}-${Date.now()}`,
      chunkIndex: chunkIdx,
      content: currentChunk.trim(),
      pageNumber: estimatedPage,
    });
  }

  return chunks;
}
