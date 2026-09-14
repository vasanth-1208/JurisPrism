import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { getAIService } from "@/lib/ai";
import { z } from "zod";

const QuestionSchema = z.object({
  question: z.string().min(2, "Question cannot be empty").max(1000),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const docId = params.id;
  const history = db.getQAInteractions(docId, user.userId);
  return NextResponse.json({ history });
}

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
    return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = QuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid question" }, { status: 400 });
    }

    const { question } = parsed.data;
    const chunks = db.getChunksByDocumentId(docId);
    const aiService = getAIService();

    const qaResult = await aiService.answerQuestion(document.rawText, question, chunks);

    const record = db.saveQAInteraction({
      id: `qa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      documentId: docId,
      userId: user.userId,
      question,
      answer: qaResult.answer,
      sources: qaResult.sources,
      confidence: qaResult.confidence,
      isFoundInDocument: qaResult.isFoundInDocument,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      interaction: record,
    });
  } catch (err: any) {
    console.error("QA error:", err);
    return NextResponse.json({ error: "Failed to answer question" }, { status: 500 });
  }
}
