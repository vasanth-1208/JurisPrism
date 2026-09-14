import React from "react";
import { AttentionLevel } from "@/types";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface AttentionBadgeProps {
  level: AttentionLevel;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function AttentionBadge({
  level,
  size = "md",
  showIcon = true,
}: AttentionBadgeProps) {
  const configs = {
    HIGH: {
      label: "High Attention",
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      icon: AlertCircle,
      iconColor: "text-rose-600",
    },
    MEDIUM: {
      label: "Medium Attention",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
    },
    LOW: {
      label: "Low Attention",
      bg: "bg-sky-50 text-sky-700 border-sky-200",
      icon: CheckCircle2,
      iconColor: "text-sky-600",
    },
    INFORMATIONAL: {
      label: "Informational",
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      icon: Info,
      iconColor: "text-slate-500",
    },
  };

  const config = configs[level] || configs.INFORMATIONAL;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
