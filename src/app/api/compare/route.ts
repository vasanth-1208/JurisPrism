import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getAIService } from "@/lib/ai";
import { z } from "zod";

const CompareSchema = z.object({
  docAId: z.string(),
  docBId: z.string(),
});

export async function GET(req: NextRequest) {
  let user = await getUserFromRequest(req);
  if (!user) {
    user = { userId: "usr-demo-001", email: "demo@jurisprism.law", name: "Alex Morgan", role: "demo" };
  }

  const comparisons = db.getComparisonsByUserId(user.userId);
  return NextResponse.json({ comparisons });
}

export async function POST(req: NextRequest) {
  let user = await getUserFromRequest(req);
  if (!user) {
    user = { userId: "usr-demo-001", email: "demo@jurisprism.law", name: "Alex Morgan", role: "demo" };
  }

  try {
    const body = await req.json();
    const parsed = CompareSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide both document IDs for comparison." }, { status: 400 });
    }

    const { docAId, docBId } = parsed.data;
    if (docAId === docBId) {
      return NextResponse.json({ error: "Please select two different documents to compare." }, { status: 400 });
    }

    const docA = db.getDocumentById(docAId, user.userId);
    const docB = db.getDocumentById(docBId, user.userId);

    if (!docA || !docB) {
      return NextResponse.json({ error: "One or both documents could not be found or access is denied." }, { status: 404 });
    }

    const aiService = getAIService();
    const comparison = await aiService.compareDocuments(
      docA.rawText,
      docB.rawText,
      docA.originalName,
      docB.originalName,
      user.userId,
      docA.id,
      docB.id
    );

    db.saveComparison(comparison);

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (err: any) {
    console.error("Comparison error:", err);
    return NextResponse.json({ error: err.message || "Failed to compare documents" }, { status: 500 });
  }
}
