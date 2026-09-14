import React from "react";
import { ObligationItem } from "@/types";
import { Clock, Calendar, ArrowUpRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ObligationAlertsWidgetProps {
  obligations: ObligationItem[];
}

export default function ObligationAlertsWidget({ obligations }: ObligationAlertsWidgetProps) {
  if (obligations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No Pending Obligations</h4>
        <p className="text-xs text-slate-400 mt-1">
          Upload and analyze an agreement to automatically track notice windows, deadlines, and renewal milestones.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-sm text-slate-900">
            Critical Obligations & Deadlines
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {obligations.length} total monitored
        </span>
      </div>

      <div className="space-y-3">
        {obligations.slice(0, 4).map((ob) => (
          <div
            key={ob.id}
            className="flex items-start justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
          >
            <div className="space-y-1 pr-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${ob.severity === "HIGH" ? "bg-rose-500" : ob.severity === "MEDIUM" ? "bg-amber-500" : "bg-sky-500"}`} />
                <h5 className="text-xs font-semibold text-slate-900">{ob.eventName}</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {ob.requiredAction}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-medium text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded">
                  {ob.relevantClause}
                </span>
                <span>• {ob.deadlineRaw}</span>
              </div>
            </div>

            <Link
              href={`/documents/${ob.documentId}?tab=timeline`}
              className="text-slate-400 hover:text-brand-600 p-1 shrink-0"
              title="View in Document Timeline"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
