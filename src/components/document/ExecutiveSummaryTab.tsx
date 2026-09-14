import React from "react";
import { DocumentAnalysisSummary, DocumentMetadata } from "@/types";
import {
  FileText,
  Users,
  Calendar,
  Scale,
  DollarSign,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ExecutiveSummaryTabProps {
  document: DocumentMetadata;
  summary: DocumentAnalysisSummary | undefined;
}

export default function ExecutiveSummaryTab({
  document,
  summary,
}: ExecutiveSummaryTabProps) {
  if (!summary) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">Summary not yet available for this document.</p>
      </div>
    );
  }

  const metadataItems = [
    {
      label: "Document Classification",
      value: summary.documentType,
      icon: FileText,
      isPresent: summary.documentType !== "Not found in document",
    },
    {
      label: "Primary Parties",
      value: `${summary.parties.partyA} & ${summary.parties.partyB}`,
      icon: Users,
      isPresent: summary.parties.partyA !== "Not found in document",
    },
    {
      label: "Effective Date",
      value: summary.effectiveDate,
      icon: Calendar,
      isPresent: summary.effectiveDate !== "Not found in document",
    },
    {
      label: "Term & Expiration",
      value: summary.termExpiry,
      icon: Calendar,
      isPresent: summary.termExpiry !== "Not found in document",
    },
    {
      label: "Governing Law & Forum",
      value: `${summary.governingLaw} (${summary.jurisdiction})`,
      icon: Scale,
      isPresent: summary.governingLaw !== "Not found in document",
    },
    {
      label: "Core Financial Terms",
      value: summary.keyFinancialTerms,
      icon: DollarSign,
      isPresent: summary.keyFinancialTerms !== "Not found in document",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Indicator of Fact vs Interpretation */}
      <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-100/70 px-4 py-2 rounded-lg border border-slate-200">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-brand-600" /> Grounding Methodology:
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Explicit Document Facts
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-500" /> AI Structural Synthesis
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-400" /> Missing / Unstated in Text
        </span>
      </div>

      {/* Structured Document Metadata Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-brand-900">
          Core Extracted Metadata
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metadataItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start gap-3"
              >
                <div className="p-2 rounded-md bg-white border border-slate-200 text-brand-700 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    {item.label}
                  </div>
                  <div className="text-xs font-semibold text-slate-900 leading-snug">
                    {item.isPresent ? (
                      item.value
                    ) : (
                      <span className="text-slate-400 italic font-normal">
                        Not found in document
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level 1: Executive Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-600" />
          <h3 className="font-bold text-base text-slate-900">
            Level 1: Executive Summary (3-Minute Synthesis)
          </h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {summary.executiveSummary}
        </p>
      </div>

      {/* Level 2: Plain-English Walkthrough */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-600" />
          <h3 className="font-bold text-base text-slate-900">
            Level 2: Plain-English Explanation (For Non-Lawyers)
          </h3>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {summary.plainEnglishExplanation}
        </p>
      </div>
    </div>
  );
}
