import fs from "fs";
import path from "path";
import {
  User,
  DocumentMetadata,
  DocumentChunk,
  DocumentAnalysisSummary,
  ClauseAnalysis,
  ObligationItem,
  QAInteraction,
  DocumentComparisonResult,
  DecisionNavigatorStep,
  PreparationKit,
} from "@/types";

export interface DatabaseSchema {
  users: User[];
  documents: DocumentMetadata[];
  documentChunks: DocumentChunk[];
  summaries: DocumentAnalysisSummary[];
  clauses: ClauseAnalysis[];
  obligations: ObligationItem[];
  qaInteractions: QAInteraction[];
  comparisons: DocumentComparisonResult[];
  decisionSteps: { documentId: string; steps: DecisionNavigatorStep[] }[];
  prepKits: PreparationKit[];
}

import defaultSeedData from "./default-seed-data.json";

const DB_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "jurisprism.db.json");

const initialData: DatabaseSchema = defaultSeedData as unknown as DatabaseSchema;

// Ensure data directory exists with bundled fallback
function ensureDbFile(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(content) as DatabaseSchema;
      if (parsed.documents && parsed.documents.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    // In serverless, fallback seamlessly to pre-bundled seed data
  }
  return JSON.parse(JSON.stringify(defaultSeedData)) as DatabaseSchema;
}

// Atomic write to prevent corruption with serverless fallback
function saveDb(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // In serverless/read-only environments like Netlify/Vercel, memoryDb maintains state for the lambda instance
    console.warn("Serverless runtime detected (read-only filesystem); maintaining in-memory storage.");
  }
}

export class Database {
  private static instance: Database;
  private memoryDb: DatabaseSchema;

  private constructor() {
    this.memoryDb = ensureDbFile();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private read(): DatabaseSchema {
    if (!this.memoryDb || !this.memoryDb.documents || this.memoryDb.documents.length === 0) {
      this.memoryDb = ensureDbFile();
    }
    return this.memoryDb;
  }

  private write(data: DatabaseSchema) {
    this.memoryDb = data;
    saveDb(data);
  }

  // ================= USERS =================
  public findUserByEmail(email: string): User | undefined {
    const db = this.read();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    const db = this.read();
    return db.users.find((u) => u.id === id);
  }

  public createUser(user: User): User {
    const db = this.read();
    db.users.push(user);
    this.write(db);
    return user;
  }

  // ================= DOCUMENTS =================
  public getDocumentsByUserId(userId: string): DocumentMetadata[] {
    const db = this.read();
    return db.documents
      .filter((d) => d.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getDocumentById(id: string, userId?: string): DocumentMetadata | undefined {
    const db = this.read();
    const doc = db.documents.find((d) => d.id === id);
    if (!doc) return undefined;
    if (userId && doc.userId !== userId) {
      // Allow demo user or public demo evaluation of demo documents
      if (doc.userId === "usr-demo-001" && (userId === "usr-demo-001" || !userId)) {
        return doc;
      }
      return undefined; // Tenant isolation guard for private user contracts
    }
    return doc;
  }

  public saveDocument(doc: DocumentMetadata): DocumentMetadata {
    const db = this.read();
    const idx = db.documents.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      db.documents[idx] = { ...doc, updatedAt: new Date().toISOString() };
    } else {
      db.documents.push(doc);
    }
    this.write(db);
    return doc;
  }

  public deleteDocument(id: string, userId: string): boolean {
    const db = this.read();
    const docIdx = db.documents.findIndex((d) => d.id === id && d.userId === userId);
    if (docIdx === -1) return false;

    db.documents.splice(docIdx, 1);
    db.documentChunks = db.documentChunks.filter((c) => c.documentId !== id);
    db.summaries = db.summaries.filter((s) => s.documentId !== id);
    db.clauses = db.clauses.filter((c) => c.documentId !== id);
    db.obligations = db.obligations.filter((o) => o.documentId !== id);
    db.qaInteractions = db.qaInteractions.filter((q) => q.documentId !== id);
    db.decisionSteps = db.decisionSteps.filter((ds) => ds.documentId !== id);
    db.prepKits = db.prepKits.filter((pk) => pk.documentId !== id);
    db.comparisons = db.comparisons.filter((comp) => comp.docAId !== id && comp.docBId !== id);

    this.write(db);
    return true;
  }

  // ================= CHUNKS =================
  public saveChunks(chunks: DocumentChunk[]): void {
    const db = this.read();
    const docId = chunks[0]?.documentId;
    if (docId) {
      db.documentChunks = db.documentChunks.filter((c) => c.documentId !== docId);
    }
    db.documentChunks.push(...chunks);
    this.write(db);
  }

  public getChunksByDocumentId(documentId: string): DocumentChunk[] {
    const db = this.read();
    return db.documentChunks
      .filter((c) => c.documentId === documentId)
      .sort((a, b) => a.chunkIndex - b.chunkIndex);
  }

  // ================= SUMMARY & ANALYSIS =================
  public saveSummary(summary: DocumentAnalysisSummary): void {
    const db = this.read();
    db.summaries = db.summaries.filter((s) => s.documentId !== summary.documentId);
    db.summaries.push(summary);
    this.write(db);
  }

  public getSummaryByDocumentId(documentId: string): DocumentAnalysisSummary | undefined {
    const db = this.read();
    return db.summaries.find((s) => s.documentId === documentId);
  }

  // ================= CLAUSES =================
  public saveClauses(clauses: ClauseAnalysis[]): void {
    const db = this.read();
    const docId = clauses[0]?.documentId;
    if (docId) {
      db.clauses = db.clauses.filter((c) => c.documentId !== docId);
    }
    db.clauses.push(...clauses);
    this.write(db);
  }

  public getClausesByDocumentId(documentId: string): ClauseAnalysis[] {
    const db = this.read();
    return db.clauses.filter((c) => c.documentId === documentId);
  }

  // ================= OBLIGATIONS =================
  public saveObligations(obligations: ObligationItem[]): void {
    const db = this.read();
    const docId = obligations[0]?.documentId;
    if (docId) {
      db.obligations = db.obligations.filter((o) => o.documentId !== docId);
    }
    db.obligations.push(...obligations);
    this.write(db);
  }

  public getObligationsByDocumentId(documentId: string): ObligationItem[] {
    const db = this.read();
    return db.obligations.filter((o) => o.documentId === documentId);
  }

  public getAllObligationsForUser(userId: string): ObligationItem[] {
    const db = this.read();
    const userDocIds = new Set(db.documents.filter((d) => d.userId === userId).map((d) => d.id));
    return db.obligations.filter((o) => userDocIds.has(o.documentId));
  }

  // ================= Q&A INTERACTIONS =================
  public saveQAInteraction(qa: QAInteraction): QAInteraction {
    const db = this.read();
    db.qaInteractions.push(qa);
    this.write(db);
    return qa;
  }

  public getQAInteractions(documentId: string, userId: string): QAInteraction[] {
    const db = this.read();
    return db.qaInteractions
      .filter((q) => q.documentId === documentId && q.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // ================= DECISION NAVIGATOR =================
  public saveDecisionSteps(documentId: string, steps: DecisionNavigatorStep[]): void {
    const db = this.read();
    db.decisionSteps = db.decisionSteps.filter((ds) => ds.documentId !== documentId);
    db.decisionSteps.push({ documentId, steps });
    this.write(db);
  }

  public getDecisionSteps(documentId: string): DecisionNavigatorStep[] | undefined {
    const db = this.read();
    return db.decisionSteps.find((ds) => ds.documentId === documentId)?.steps;
  }

  // ================= PREPARATION KITS =================
  public savePrepKit(kit: PreparationKit): PreparationKit {
    const db = this.read();
    db.prepKits = db.prepKits.filter((pk) => pk.documentId !== kit.documentId);
    db.prepKits.push(kit);
    this.write(db);
    return kit;
  }

  public getPrepKit(documentId: string, userId?: string): PreparationKit | undefined {
    const db = this.read();
    return db.prepKits.find((pk) => pk.documentId === documentId && (!userId || pk.userId === userId));
  }

  // ================= COMPARISONS =================
  public saveComparison(comp: DocumentComparisonResult): DocumentComparisonResult {
    const db = this.read();
    db.comparisons = db.comparisons.filter((c) => c.id !== comp.id);
    db.comparisons.push(comp);
    this.write(db);
    return comp;
  }

  public getComparisonsByUserId(userId: string): DocumentComparisonResult[] {
    const db = this.read();
    return db.comparisons
      .filter((c) => c.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getComparisonById(id: string, userId: string): DocumentComparisonResult | undefined {
    const db = this.read();
    return db.comparisons.find((c) => c.id === id && c.userId === userId);
  }
}

export const db = Database.getInstance();
