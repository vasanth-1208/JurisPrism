"use client";

import React, { useState } from "react";
import { PreparationKit } from "@/types";
import {
  Download,
  Printer,
  Copy,
  Check,
  CheckSquare,
  HelpCircle,
  FileText,
  AlertTriangle,
  FolderOpen,
  Send,
  Calendar,
} from "lucide-react";

interface PrepKitTabProps {
  documentId: string;
  prepKit: PreparationKit | undefined;
}

export default function PrepKitTab({ documentId, prepKit }: PrepKitTabProps) {
  const [copied, setCopied] = useState(false);

  if (!prepKit) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">Attorney Preparation Kit not yet generated.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    window.open(`/api/documents/${documentId}/export?format=markdown`, "_blank");
  };

  const handleCopySummary = () => {
    const text = `ATTORNEY CONSULTATION PREPARATION REPORT: ${prepKit.documentTitle}
Generated: ${new Date().toLocaleDateString()}

1. ABOUT THIS DOCUMENT:
${prepKit.sections.aboutDocument}

2. WHAT I AM AGREEING TO:
${prepKit.sections.whatIAmAgreeingTo.map((i) => `- ${i}`).join("\n")}

3. KEY OBLIGATIONS:
${prepKit.sections.myKeyObligations.map((o) => `- ${o.obligation} (${o.deadline}) [${o.clause}]`).join("\n")}

4. QUESTIONS FOR MY LAWYER:
${prepKit.sections.questionsForMyLawyer.map((q) => `[${q.priority}] ${q.question} (Reason: ${q.reason})`).join("\n")}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Attorney Consultation Preparation Kit
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured briefing dossier to maximize consultation leverage and minimize legal billable hours.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Brief"}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-lg shadow transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      {/* Printable 8-Point Preparation Kit Dossier */}
      <div className="space-y-6 card-print">
        {/* Section 1: About the Document */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-[10px]">1</span>
            What This Document Is About
          </div>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {prepKit.sections.aboutDocument}
          </p>
        </div>

        {/* Section 2: What I Am Agreeing To */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-[10px]">2</span>
            What You Are Agreeing To
          </div>
          <ul className="space-y-2">
            {prepKit.sections.whatIAmAgreeingTo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: My Key Obligations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-[10px]">3</span>
            Your Key Obligations & Mandatory Duties
          </div>
          <div className="divide-y divide-slate-100">
            {prepKit.sections.myKeyObligations.map((ob, idx) => (
              <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-800 font-medium">
                  {ob.obligation}
                </div>
                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {ob.deadline}
                  </span>
                  <span className="text-[11px] text-slate-400">({ob.clause})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Critical Dates & Deadlines */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-[10px]">4</span>
            Important Dates & Notice Windows
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prepKit.sections.importantDatesAndDeadlines.map((dt, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{dt.event}</span>
                  <span className="text-amber-800 font-semibold text-[11px]">{dt.deadline}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{dt.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: High Priority Areas to Review */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">5</span>
            Potential Areas to Review with Counsel
          </div>
          <div className="space-y-2">
            {prepKit.sections.highPriorityReviewAreas.map((area, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-900">{area.issue}</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-mono">
                    {area.clauseRef}
                  </span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed">{area.potentialImpact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Questions for My Lawyer */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">6</span>
            Prioritized Questions for Your Attorney
          </div>
          <div className="space-y-3">
            {prepKit.sections.questionsForMyLawyer.map((q, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${q.priority === "HIGH" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
                    {q.priority}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900">"{q.question}"</h5>
                </div>
                <p className="text-xs text-slate-500 italic pl-7">Rationale: {q.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7 & 8: Documents to Gather & Pre-signing Checklists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 7 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">7</span>
              Documents / Info to Gather Before Meeting
            </div>
            <ul className="space-y-2">
              {prepKit.sections.documentsAndInfoToGather.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckSquare className="w-3.5 h-3.5 text-brand-600 mt-0.5 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 8 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-900">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">8</span>
              Things to Clarify Before Signing
            </div>
            <ul className="space-y-2">
              {prepKit.sections.preSigningNegotiationPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
