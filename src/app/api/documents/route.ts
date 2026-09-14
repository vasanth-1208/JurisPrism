import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { extractTextFromBuffer, chunkDocumentText, computeSha256 } from "@/lib/parser/extractor";
import { getAIService } from "@/lib/ai";
import { DEMO_CONTRACTS } from "@/lib/demo/contracts";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const docs = db.getDocumentsByUserId(user.userId);
  return NextResponse.json({ documents: docs });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") || "";

  // A. Load Demo Contract by ID
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      const demoContract = DEMO_CONTRACTS.find((c) => c.id === body.demoId);
      if (!demoContract) {
        return NextResponse.json({ error: "Specified demo contract not found" }, { status: 404 });
      }

      const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const buffer = Buffer.from(demoContract.rawText, "utf-8");
      const sha256 = computeSha256(buffer);

      // Create document entry
      const newDoc = db.saveDocument({
        id: docId,
        userId: user.userId,
        filename: demoContract.filename,
        originalName: demoContract.title,
        mimeType: "text/plain",
        fileSize: buffer.length,
        sha256Hash: sha256,
        documentType: demoContract.documentType,
        status: "PROCESSING",
        pageCount: Math.max(1, Math.ceil(demoContract.rawText.length / 3000)),
        rawText: demoContract.rawText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Process and analyze
      const chunks = chunkDocumentText(demoContract.rawText).map((c) => ({
        ...c,
        documentId: docId,
      }));
      db.saveChunks(chunks);

      const aiService = getAIService();
      const analysis = await aiService.analyzeDocument(demoContract.rawText, demoContract.title);

      db.saveSummary({
        id: `sum-${docId}`,
        documentId: docId,
        createdAt: new Date().toISOString(),
        ...analysis.summary,
      });

      const fullClauses = analysis.clauses.map((c, idx) => ({
        id: `cls-${docId}-${idx}`,
        documentId: docId,
        ...c,
      }));
      db.saveClauses(fullClauses);

      const fullObligations = analysis.obligations.map((o, idx) => ({
        id: `ob-${docId}-${idx}`,
        documentId: docId,
        ...o,
      }));
      db.saveObligations(fullObligations);

      db.saveDecisionSteps(docId, analysis.decisionSteps);

      db.savePrepKit({
        id: `pk-${docId}`,
        documentId: docId,
        userId: user.userId,
        documentTitle: demoContract.title,
        generatedAt: new Date().toISOString(),
        sections: analysis.prepKit,
      });

      // Mark ready
      newDoc.status = "ANALYZED";
      db.saveDocument(newDoc);

      return NextResponse.json({
        success: true,
        document: newDoc,
        message: "Document successfully processed and analyzed.",
      });
    } catch (err: any) {
      console.error("Failed to load demo contract:", err);
      return NextResponse.json({ error: err.message || "Failed to process document" }, { status: 500 });
    }
  }

  // B. File Upload (multipart/form-data)
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided. Please attach a document." }, { status: 400 });
    }

    // Size limit check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the maximum allowable limit of 10MB." },
        { status: 400 }
      );
    }

    const filename = file.name;
    const ext = filename.toLowerCase().split(".").pop();
    const allowedExts = ["pdf", "docx", "txt"];
    if (!ext || !allowedExts.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file type (.${ext}). Only PDF, DOCX, and TXT legal documents are accepted.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text safely
    let extracted: { text: string; pageCount: number };
    try {
      extracted = await extractTextFromBuffer(buffer, file.type, filename);
    } catch (parseErr: any) {
      return NextResponse.json({ error: parseErr.message }, { status: 422 });
    }

    if (!extracted.text || extracted.text.trim().length < 20) {
      return NextResponse.json(
        { error: "The uploaded file does not contain extractable legal text. Please ensure the document is not an image-only scanned scan without text." },
        { status: 422 }
      );
    }

    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const sha256 = computeSha256(buffer);

    const newDoc = db.saveDocument({
      id: docId,
      userId: user.userId,
      filename,
      originalName: filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      mimeType: file.type || `application/${ext}`,
      fileSize: file.size,
      sha256Hash: sha256,
      documentType: "Legal Document",
      status: "PROCESSING",
      pageCount: extracted.pageCount,
      rawText: extracted.text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Chunking
    const chunks = chunkDocumentText(extracted.text).map((c) => ({
      ...c,
      documentId: docId,
    }));
    db.saveChunks(chunks);

    // Run AI analysis
    const aiService = getAIService();
    const analysis = await aiService.analyzeDocument(extracted.text, filename);

    db.saveSummary({
      id: `sum-${docId}`,
      documentId: docId,
      createdAt: new Date().toISOString(),
      ...analysis.summary,
    });

    const fullClauses = analysis.clauses.map((c, idx) => ({
      id: `cls-${docId}-${idx}`,
      documentId: docId,
      ...c,
    }));
    db.saveClauses(fullClauses);

    const fullObligations = analysis.obligations.map((o, idx) => ({
      id: `ob-${docId}-${idx}`,
      documentId: docId,
      ...o,
    }));
    db.saveObligations(fullObligations);

    db.saveDecisionSteps(docId, analysis.decisionSteps);

    db.savePrepKit({
      id: `pk-${docId}`,
      documentId: docId,
      userId: user.userId,
      documentTitle: newDoc.originalName,
      generatedAt: new Date().toISOString(),
      sections: analysis.prepKit,
    });

    newDoc.status = "ANALYZED";
    newDoc.documentType = analysis.summary.documentType;
    db.saveDocument(newDoc);

    return NextResponse.json({
      success: true,
      document: newDoc,
      message: "File successfully uploaded, parsed, and analyzed.",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred during document ingestion." }, { status: 500 });
  }
}
