import { describe, it, expect, beforeEach } from "vitest";
import { Database } from "@/lib/db";
import { DocumentMetadata } from "@/types";

describe("Security & Multi-Tenant Isolation Tests", () => {
  let db: Database;

  beforeEach(() => {
    db = Database.getInstance();
  });

  it("ensures User B cannot read or access User A's uploaded documents", () => {
    const userA_Id = "user-alice-123";
    const userB_Id = "user-bob-456";

    // Alice uploads a sensitive contract
    const aliceDoc: DocumentMetadata = {
      id: "doc-alice-confidential-001",
      userId: userA_Id,
      filename: "Alice_Employment_Agreement.txt",
      originalName: "Alice Confidential Agreement",
      mimeType: "text/plain",
      fileSize: 4096,
      sha256Hash: "abcdef1234567890",
      documentType: "Employment Agreement",
      status: "ANALYZED",
      pageCount: 2,
      rawText: "Confidential terms for Alice with salary $250,000.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.saveDocument(aliceDoc);

    // Alice can retrieve her own document
    const aliceFetch = db.getDocumentById("doc-alice-confidential-001", userA_Id);
    expect(aliceFetch).toBeDefined();
    expect(aliceFetch?.id).toBe("doc-alice-confidential-001");

    // Bob tries to access Alice's document directly by ID -> MUST return undefined (Tenant Isolation Guard)
    const bobFetch = db.getDocumentById("doc-alice-confidential-001", userB_Id);
    expect(bobFetch).toBeUndefined();

    // Bob querying list of documents -> Alice's document must NOT appear in Bob's document vault
    const bobDocs = db.getDocumentsByUserId(userB_Id);
    const hasAliceDocInBobList = bobDocs.some((d) => d.id === "doc-alice-confidential-001");
    expect(hasAliceDocInBobList).toBe(false);
  });

  it("prevents User B from deleting User A's document", () => {
    const userA_Id = "user-alice-123";
    const userB_Id = "user-bob-456";

    const docId = "doc-alice-to-delete-002";
    db.saveDocument({
      id: docId,
      userId: userA_Id,
      filename: "Alice_IP_Assignment.txt",
      originalName: "Alice IP Assignment",
      mimeType: "text/plain",
      fileSize: 2048,
      sha256Hash: "112233445566",
      documentType: "Intellectual Property",
      status: "ANALYZED",
      pageCount: 1,
      rawText: "Alice IP terms.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Bob attempts to delete Alice's document -> MUST fail and return false
    const deleteResult = db.deleteDocument(docId, userB_Id);
    expect(deleteResult).toBe(false);

    // Document must still exist in Alice's vault
    const docStillExists = db.getDocumentById(docId, userA_Id);
    expect(docStillExists).toBeDefined();

    // Alice deleting her own document -> succeeds
    const aliceDeleteResult = db.deleteDocument(docId, userA_Id);
    expect(aliceDeleteResult).toBe(true);

    const docAfterAliceDelete = db.getDocumentById(docId, userA_Id);
    expect(docAfterAliceDelete).toBeUndefined();
  });
});
