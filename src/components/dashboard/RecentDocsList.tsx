"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DocumentMetadata } from "@/types";
import {
  FileText,
  Calendar,
  ExternalLink,
  Trash2,
  GitCompare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface RecentDocsListProps {
  documents: DocumentMetadata[];
  onDocumentDeleted?: (id: string) => void;
}

export default function RecentDocsList({
  documents,
  onDocumentDeleted,
}: RecentDocsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this document and all its derived legal analyses?")) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok && onDocumentDeleted) {
        onDocumentDeleted(id);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No Documents Ingested Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
          Upload an employment agreement, commercial lease, or contract to generate an automated legal analysis.
        </p>
        <Link
          href="/documents/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-lg shadow transition-colors"
        >
          Upload First Document
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900">
          Document Intelligence Vault ({documents.length})
        </h3>
        <span className="text-xs text-slate-400">Isolated per-session repository</span>
      </div>

      <div className="divide-y divide-slate-100">
        {documents.map((doc) => {
          const isAnalyzed = doc.status === "ANALYZED";
          const isProcessing = doc.status === "PROCESSING" || doc.status === "PENDING";
          const isError = doc.status === "ERROR";

          return (
            <div
              key={doc.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="font-semibold text-sm text-slate-900 hover:text-brand-700 transition-colors"
                    >
                      {doc.originalName}
                    </Link>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {doc.documentType}
                    </span>

                    {/* Status Badge */}
                    {isAnalyzed && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    )}
                    {isProcessing && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Processing
                      </span>
                    )}
                    {isError && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertCircle className="w-3 h-3" /> Error
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(doc.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>{doc.pageCount} page(s)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  href={`/documents/${doc.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-semibold rounded-lg transition-colors"
                >
                  <span>Open Analysis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/compare?primaryDocId=${doc.id}`}
                  title="Compare with another agreement"
                  className="p-1.5 text-slate-400 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <GitCompare className="w-4 h-4" />
                </Link>

                <button
                  onClick={(e) => handleDelete(doc.id, e)}
                  disabled={deletingId === doc.id}
                  title="Permanently delete document"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === doc.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
