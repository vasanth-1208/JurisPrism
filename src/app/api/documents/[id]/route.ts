import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function GET(
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
    return NextResponse.json(
      { error: "Document not found or access denied." },
      { status: 404 }
    );
  }

  const summary = db.getSummaryByDocumentId(docId);
  const clauses = db.getClausesByDocumentId(docId);
  const obligations = db.getObligationsByDocumentId(docId);
  const decisionSteps = db.getDecisionSteps(docId) || [];
  const prepKit = db.getPrepKit(docId, user.userId);

  return NextResponse.json({
    document,
    summary,
    clauses,
    obligations,
    decisionSteps,
    prepKit,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docId = params.id;
  const deleted = db.deleteDocument(docId, user.userId);

  if (!deleted) {
    return NextResponse.json(
      { error: "Document not found or you do not have permission to delete it." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Document, extracted clauses, timeline, and associated analyses permanently deleted.",
  });
}
