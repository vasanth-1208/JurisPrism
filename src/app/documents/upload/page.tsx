import React from "react";
import DropZone from "../../../components/upload/DropZone";
import { Scale, Lock, ShieldCheck, FileCheck } from "lucide-react";
import Link from "next/link";

export default function DocumentUploadPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5 text-brand-600" />
          <span>Stage 1: Document Ingestion & Extraction</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">
          Upload Legal Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Upload any contract, commercial lease, NDA, or terms document. Our pipeline strips formatting artifacts, structures sections, and highlights critical provisions.
        </p>
      </div>

      {/* Main Drag-and-Drop & Sample Contracts Container */}
      <DropZone />

      {/* Ingestion Security Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs text-slate-500">
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 block">Isolated Storage:</span>
            Documents are accessible only by your authenticated session.
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 block">Prompt-Injection Defense:</span>
            Document text is sanitized and treated purely as passive data.
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200">
          <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 block">Integrity Verification:</span>
            SHA-256 checksums prevent corrupted or modified payloads.
          </div>
        </div>
      </div>
    </div>
  );
}
