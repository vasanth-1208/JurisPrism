"use client";

import React, { useState } from "react";
import { ClauseAnalysis, AttentionLevel } from "@/types";
import AttentionBadge from "@/components/ui/AttentionBadge";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Scale,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface AttentionMapTabProps {
  clauses: ClauseAnalysis[];
}

export default function AttentionMapTab({ clauses }: AttentionMapTabProps) {
  const [activeTier, setActiveTier] = useState<AttentionLevel | "ALL">("ALL");

  const highItems = clauses.filter((c) => c.attentionLevel === "HIGH");
  const mediumItems = clauses.filter((c) => c.attentionLevel === "MEDIUM");
  const lowItems = clauses.filter((c) => c.attentionLevel === "LOW");
  const infoItems = clauses.filter((c) => c.attentionLevel === "INFORMATIONAL");

  const displayedClauses = clauses.filter((c) =>
    activeTier === "ALL" ? true : c.attentionLevel === activeTier
  );

  return (
    <div className="space-y-6">
      {/* Ethical Language Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            Disciplined Legal Attention Taxonomy
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            Findings indicate <strong>areas worth reviewing</strong> or that <strong>may create significant obligations</strong>. JurisPrism does not pronounce provisions definitively "illegal" or "enforceable"; statutory determinations require an attorney licensed in the governing jurisdiction.
          </p>
        </div>
      </div>

      {/* Visual Attention Tier Breakdown Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTier(activeTier === "HIGH" ? "ALL" : "HIGH")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTier === "HIGH"
              ? "border-rose-500 bg-rose-50/80 ring-2 ring-rose-400"
              : "border-slate-200 bg-white hover:border-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">High Attention</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{highItems.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Critical review needed</div>
        </button>

        <button
          onClick={() => setActiveTier(activeTier === "MEDIUM" ? "ALL" : "MEDIUM")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTier === "MEDIUM"
              ? "border-amber-500 bg-amber-50/80 ring-2 ring-amber-400"
              : "border-slate-200 bg-white hover:border-amber-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Medium Attention</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{mediumItems.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Notable terms & notices</div>
        </button>

        <button
          onClick={() => setActiveTier(activeTier === "LOW" ? "ALL" : "LOW")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTier === "LOW"
              ? "border-sky-500 bg-sky-50/80 ring-2 ring-sky-400"
              : "border-slate-200 bg-white hover:border-sky-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-700">Low Attention</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{lowItems.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Standard market terms</div>
        </button>

        <button
          onClick={() => setActiveTier(activeTier === "INFORMATIONAL" ? "ALL" : "INFORMATIONAL")}
          className={`p-4 rounded-xl border text-left transition-all ${
            activeTier === "INFORMATIONAL"
              ? "border-slate-500 bg-slate-100 ring-2 ring-slate-400"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Informational</span>
            <Info className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{infoItems.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Operational definitions</div>
        </button>
      </div>

      {/* Attention Heatmap Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Legal Attention Registry ({displayedClauses.length} Findings)
          </h3>
          {activeTier !== "ALL" && (
            <button
              onClick={() => setActiveTier("ALL")}
              className="text-xs text-brand-600 hover:underline font-medium"
            >
              Reset to All Tiers
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {displayedClauses.map((item) => (
            <div key={item.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {item.sectionNumber || "Clause"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                </div>
                <AttentionBadge level={item.attentionLevel} size="sm" />
              </div>

              {/* Finding Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                      Issue & Context:
                    </span>
                    <p className="text-slate-800 leading-relaxed mt-0.5">
                      {item.plainExplanation}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">
                      Potential Impact / Exposure:
                    </span>
                    <p className="text-slate-800 leading-relaxed mt-0.5">
                      {item.whyItMatters}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-bold text-amber-800 uppercase text-[10px] tracking-wider block">
                      Why Review It:
                    </span>
                    <p className="text-slate-700 leading-relaxed mt-0.5">
                      {item.potentialConcern}
                    </p>
                  </div>
                  <div className="pt-1 border-t border-slate-200">
                    <span className="font-bold text-brand-800 uppercase text-[10px] tracking-wider block">
                      Suggested Question for Lawyer:
                    </span>
                    <p className="text-brand-950 font-medium leading-relaxed mt-0.5 italic">
                      "{item.suggestedQuestion}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
