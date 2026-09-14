import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeedData, DEMO_USER_ID, DEMO_USER_EMAIL } from "@/lib/db/seed";
import { signToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { DEMO_CONTRACTS } from "@/lib/demo/contracts";
import { chunkDocumentText, computeSha256 } from "@/lib/parser/extractor";
import { getAIService } from "@/lib/ai";

export async function POST() {
  try {
    await ensureSeedData();
    const user = db.findUserById(DEMO_USER_ID);

    if (!user) {
      return NextResponse.json({ error: "Failed to initialize demo profile" }, { status: 500 });
    }

    // Check if demo user already has sample documents; if not, seed the 3 contracts
    const existingDocs = db.getDocumentsByUserId(DEMO_USER_ID);
    if (existingDocs.length === 0) {
      const aiService = getAIService();

      for (const contract of DEMO_CONTRACTS) {
        const buffer = Buffer.from(contract.rawText, "utf-8");
        const docId = `doc-${contract.id}`;
        const sha256 = computeSha256(buffer);

        // 1. Create document entry
        const doc = db.saveDocument({
          id: docId,
          userId: DEMO_USER_ID,
          filename: contract.filename,
          originalName: contract.title,
          mimeType: "text/plain",
          fileSize: buffer.length,
          sha256Hash: sha256,
          documentType: contract.documentType,
          status: "ANALYZED",
          pageCount: Math.max(1, Math.ceil(contract.rawText.length / 3000)),
          rawText: contract.rawText,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // 2. Chunks
        const rawChunks = chunkDocumentText(contract.rawText);
        const fullChunks = rawChunks.map((c) => ({
          ...c,
          documentId: docId,
        }));
        db.saveChunks(fullChunks);

        // 3. Run Analysis
        const analysis = await aiService.analyzeDocument(contract.rawText, contract.title);

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
          userId: DEMO_USER_ID,
          documentTitle: contract.title,
          generatedAt: new Date().toISOString(),
          sections: analysis.prepKit,
        });
      }
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
      message: "Authenticated as Demo Legal Reviewer",
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Failed to initialize demo session." }, { status: 500 });
  }
}
