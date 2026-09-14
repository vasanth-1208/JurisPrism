import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getAIService } from "@/lib/ai";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docId = params.id;
  const document = db.getDocumentById(docId, user.userId);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    document.status = "PROCESSING";
    db.saveDocument(document);

    const aiService = getAIService();
    const analysis = await aiService.analyzeDocument(document.rawText, document.originalName);

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
      documentTitle: document.originalName,
      generatedAt: new Date().toISOString(),
      sections: analysis.prepKit,
    });

    document.status = "ANALYZED";
    document.documentType = analysis.summary.documentType;
    db.saveDocument(document);

    return NextResponse.json({
      success: true,
      message: "Document successfully re-analyzed.",
      summary: analysis.summary,
      clausesCount: analysis.clauses.length,
      obligationsCount: analysis.obligations.length,
    });
  } catch (err: any) {
    document.status = "ERROR";
    document.statusMessage = err.message;
    db.saveDocument(document);
    return NextResponse.json({ error: "Analysis execution failed" }, { status: 500 });
  }
}
