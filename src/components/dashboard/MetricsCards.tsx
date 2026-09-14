import React from "react";
import { FileText, AlertTriangle, Calendar, Award } from "lucide-react";

interface MetricsCardsProps {
  totalDocuments: number;
  highAttentionCount: number;
  upcomingDeadlinesCount: number;
  prepKitsCount: number;
}

export default function MetricsCards({
  totalDocuments,
  highAttentionCount,
  upcomingDeadlinesCount,
  prepKitsCount,
}: MetricsCardsProps) {
  const cards = [
    {
      label: "Ingested Documents",
      value: totalDocuments,
      icon: FileText,
      iconColor: "text-brand-600",
      bgColor: "bg-brand-50",
      description: "Structured in isolated vault",
    },
    {
      label: "High Attention Points",
      value: highAttentionCount,
      icon: AlertTriangle,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      description: "Require attorney review",
    },
    {
      label: "Obligations & Deadlines",
      value: upcomingDeadlinesCount,
      icon: Calendar,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Notice & payment windows",
    },
    {
      label: "Attorney Prep Kits",
      value: prepKitsCount,
      icon: Award,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Actionable briefing dossiers",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bgColor} ${card.iconColor} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{card.value}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}
