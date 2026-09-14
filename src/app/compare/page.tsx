"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DocumentMetadata, DocumentComparisonResult } from "@/types";
import ComparisonMatrix from "../../components/compare/ComparisonMatrix";
import {
  GitCompare,
  ArrowRight,
  Sparkles,
  Loader2,
  AlertCircle,
  FileText,
  Scale,
} from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const primaryDocIdParam = searchParams.get("primaryDocId");

  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [docAId, setDocAId] = useState<string>(primaryDocIdParam || "");
  const [docBId, setDocBId] = useState<string>("");
  const [comparison, setComparison] = useState<DocumentComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDocs, setFetchingDocs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        const docs: DocumentMetadata[] = data.documents || [];
        setDocuments(docs);
        if (docs.length >= 2) {
          if (!docAId) setDocAId(docs[0].id);
          setDocBId(docs[1].id);
        } else if (docs.length === 1 && !docAId) {
          setDocAId(docs[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setFetchingDocs(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompare = async () => {
    if (!docAId || !docBId) {
      setError("Please select two documents to compare.");
      return;
    }
    if (docAId === docBId) {
      setError("Please select two different documents to compare.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docAId, docBId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Comparison failed");
      }
      setComparison(data.comparison);
    } catch (err: any) {
      setError(err.message || "Failed to compare documents");
    } finally {
      setLoading(false);
    }
  };

  const handle1ClickSampleCompare = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure seed contracts are loaded
      await fetch("/api/auth/demo", { method: "POST" });
      const docsRes = await fetch("/api/documents");
      const docsData = await docsRes.json();
      const docs: DocumentMetadata[] = docsData.documents || [];
      setDocuments(docs);

      // Find company draft and redline draft
      const baseDoc = docs.find((d) => d.filename.includes("Acme_Technologies") || d.id === "doc-demo-employment-agreement");
      const redlineDoc = docs.find((d) => d.filename.includes("Redline") || d.id === "doc-demo-employment-redline");

      if (baseDoc && redlineDoc) {
        setDocAId(baseDoc.id);
        setDocBId(redlineDoc.id);

        const res = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ docAId: baseDoc.id, docBId: redlineDoc.id }),
        });
        const compData = await res.json();
        if (compData.comparison) {
          setComparison(compData.comparison);
        }
      }
    } catch (err: any) {
      setError("Failed to run sample comparison.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Scale className="w-4 h-4 text-brand-600" />
            Structural Diff & Risk Delta Engine
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Compare Legal Agreements
          </h1>
          <p className="text-xs text-slate-500">
            Evaluates clause additions, deletions, modified obligations, and shifting liability balance.
          </p>
        </div>

        <button
          onClick={handle1ClickSampleCompare}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition-colors shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Compare Sample Employment Draft vs Redline</span>
        </button>
      </div>

      {/* Document Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Select Agreements for Comparison
        </h3>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Doc A */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Document A (Base Draft)
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">-- Choose First Document --</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.originalName} ({doc.documentType})
                </option>
              ))}
            </select>
          </div>

          {/* Doc B */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Document B (Revised / Counter Draft)
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">-- Choose Second Document --</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.originalName} ({doc.documentType})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleCompare}
            disabled={loading || !docAId || !docBId}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Structural Differences...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-3.5 h-3.5" />
                <span>Execute Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && <ComparisonMatrix comparison={comparison} />}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
