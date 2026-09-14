"use client";

import React, { useState } from "react";
import { ObligationItem } from "@/types";
import AttentionBadge from "../ui/AttentionBadge";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";

interface TimelineTabProps {
  obligations: ObligationItem[];
}

export default function TimelineTab({ obligations }: TimelineTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyChecklist = () => {
    const lines = obligations.map(
      (o, idx) =>
        `${idx + 1}. [ ] ${o.eventName}\n   Deadline: ${o.deadlineRaw}\n   Action Required: ${o.requiredAction}\n   Clause: ${o.relevantClause}`
    );
    navigator.clipboard.writeText(lines.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Obligation & Critical Deadline Timeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserves literal relative notice conditions (e.g. "30 days prior to expiration") to prevent synthetic date hallucination.
          </p>
        </div>

        <button
          onClick={handleCopyChecklist}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied Checklist!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy as Action Checklist</span>
            </>
          )}
        </button>
      </div>

      {/* Chronological Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {obligations.map((item, idx) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot Indicator */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm text-white text-[10px] font-bold ${
                item.severity === "HIGH"
                  ? "bg-rose-500"
                  : item.severity === "MEDIUM"
                  ? "bg-amber-500"
                  : "bg-sky-500"
              }`}
            >
              {idx + 1}
            </div>

            {/* Event Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{item.eventName}</h4>
                  <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {item.relevantClause}
                  </span>
                </div>
                <AttentionBadge level={item.severity} size="sm" />
              </div>

              {/* Deadline Box */}
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Trigger / Window: {item.deadlineRaw}</span>
                {item.dueDateEstimated && (
                  <span className="text-slate-500 font-normal ml-auto">
                    (Est: {item.dueDateEstimated})
                  </span>
                )}
              </div>

              {/* Action Required */}
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Mandatory Action: </span>
                {item.requiredAction}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
