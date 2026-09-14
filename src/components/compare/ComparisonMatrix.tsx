"use client";

import React from "react";
import { DocumentComparisonResult } from "@/types";
import {
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  Scale,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ComparisonMatrixProps {
  comparison: DocumentComparisonResult;
}

export default function ComparisonMatrix({ comparison }: ComparisonMatrixProps) {
  const getChangeBadge = (type: string) => {
    switch (type) {
      case "REMOVED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <MinusCircle className="w-3 h-3" /> Removed
          </span>
        );
      case "ADDED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <PlusCircle className="w-3 h-3" /> Added
          </span>
        );
      case "MODIFIED":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <RefreshCw className="w-3 h-3" /> Modified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Unchanged
          </span>
        );
    }
  };

  const getSignificanceBadge = (sig: string) => {
    switch (sig) {
      case "HIGH":
        return (
          <span className="text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded uppercase tracking-wider">
            High Significance
          </span>
        );
      case "MEDIUM":
        return (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded uppercase tracking-wider">
            Medium Significance
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded uppercase tracking-wider">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-brand-900 font-bold text-base">
            <GitCompare className="w-5 h-5 text-brand-600" />
            Structural Contract Comparison Matrix
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
              {comparison.majorChangesCount.high} High-Impact Deltas
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
              {comparison.majorChangesCount.medium} Medium Deltas
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          {comparison.overviewSummary}
        </p>

        {/* Document Headers Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Document A (Base Draft):
            </span>
            <span className="font-semibold text-slate-900">{comparison.docAName}</span>
          </div>
          <div className="p-3 rounded-lg bg-brand-50/50 border border-brand-200 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">
              Document B (Revised / Counter Draft):
            </span>
            <span className="font-semibold text-brand-950">{comparison.docBName}</span>
          </div>
        </div>
      </div>

      {/* 3-Column Structural Diff Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <div className="col-span-3">Clause / Topic</div>
          <div className="col-span-3">Document A (Base)</div>
          <div className="col-span-3">Document B (Revised)</div>
          <div className="col-span-3">Legal Significance & Impact</div>
        </div>

        <div className="divide-y divide-slate-200">
          {comparison.clauses.map((clause, idx) => (
            <div
              key={idx}
              className="p-6 lg:grid lg:grid-cols-12 lg:gap-4 hover:bg-slate-50/60 transition-colors space-y-3 lg:space-y-0"
            >
              {/* Clause Header & Category */}
              <div className="col-span-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  {getChangeBadge(clause.changeType)}
                  {getSignificanceBadge(clause.significance)}
                </div>
                <h4 className="font-bold text-xs text-slate-900">{clause.clauseTitle}</h4>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {clause.category}
                </span>
              </div>

              {/* Document A Content */}
              <div className="col-span-3 text-xs text-slate-700 space-y-1 bg-slate-50/70 lg:bg-transparent p-3 lg:p-0 rounded-lg">
                <span className="lg:hidden text-[10px] font-bold text-slate-400 block uppercase">
                  Document A:
                </span>
                <p className="leading-relaxed font-serif italic">{clause.docAContent}</p>
              </div>

              {/* Document B Content */}
              <div className="col-span-3 text-xs text-slate-900 space-y-1 bg-brand-50/30 lg:bg-transparent p-3 lg:p-0 rounded-lg">
                <span className="lg:hidden text-[10px] font-bold text-brand-700 block uppercase">
                  Document B:
                </span>
                <p className="leading-relaxed font-serif italic font-medium">
                  {clause.docBContent}
                </p>
              </div>

              {/* Significance & Impact */}
              <div className="col-span-3 text-xs space-y-2 bg-amber-50/40 lg:bg-transparent p-3 lg:p-0 rounded-lg">
                <span className="lg:hidden text-[10px] font-bold text-amber-800 block uppercase">
                  Significance & Advice:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {clause.plainEnglishImpact}
                </p>
                <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-brand-800 block">Clarification Note:</span>
                  {clause.suggestedClarification}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
