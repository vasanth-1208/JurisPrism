"use client";

import React, { useState } from "react";
import { DecisionNavigatorStep, AttentionLevel } from "@/types";
import AttentionBadge from "@/components/ui/AttentionBadge";
import {
  Compass,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  FileQuestion,
  Layers,
  Sparkles,
} from "lucide-react";

interface DecisionNavigatorTabProps {
  steps: DecisionNavigatorStep[];
}

export default function DecisionNavigatorTab({ steps }: DecisionNavigatorTabProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!steps || steps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">Decision Navigator steps not yet initialized.</p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex] || steps[0];

  const stepIcons = [
    Layers,
    CheckCircle,
    AlertTriangle,
    FileQuestion,
    Sparkles,
    HelpCircle,
  ];

  return (
    <div className="space-y-6">
      {/* Navigator Hero Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          The Decision Navigator (Proprietary Preparation Flow)
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
          Objective Decision Preparation Framework
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Unlike generic tools that attempt to give risky, unauthorized legal advice ("Sign this" or "Do not sign"), the Decision Navigator systematically frames your contract review so you can consult counsel with maximum leverage and total clarity.
        </p>

        {/* Strict Ethical Guardrail Callout */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-amber-300 font-medium">
          <span>“Before making a decision, consider reviewing these points…”</span>
        </div>
      </div>

      {/* Step Stepper Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {steps.map((step, idx) => {
            const Icon = stepIcons[idx] || Compass;
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-2.5 rounded-lg text-left transition-all flex flex-col justify-between border ${
                  isCurrent
                    ? "bg-brand-50 border-brand-500 ring-2 ring-brand-300"
                    : isPast
                    ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    : "border-transparent text-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Step {idx + 1}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? "text-brand-700" : isPast ? "text-emerald-600" : "text-slate-400"}`} />
                </div>
                <span className="text-xs font-semibold mt-1 leading-snug line-clamp-1">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Content Container */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">• Decision Preparation</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{currentStep.title}</h3>
          <p className="text-xs text-slate-500 font-medium">{currentStep.subtitle}</p>
        </div>

        {/* Step Summary */}
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
          {currentStep.summary}
        </p>

        {/* Warning Banner if present */}
        {currentStep.warningBanner && (
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{currentStep.warningBanner}</span>
          </div>
        )}

        {/* Structured Checklist Items */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Review Points & Observations:
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {currentStep.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                    <h5 className="font-semibold text-xs text-slate-900">{item.label}</h5>
                    {item.sourceRef && (
                      <span className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                        {item.sourceRef}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-3.5">
                    {item.description}
                  </p>
                </div>

                {item.concernLevel && (
                  <div className="self-start shrink-0">
                    <AttentionBadge level={item.concernLevel} size="sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Step
          </button>

          <span className="text-xs text-slate-400">
            {currentStepIndex + 1} / {steps.length}
          </span>

          <button
            onClick={() =>
              setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))
            }
            disabled={currentStepIndex === steps.length - 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-brand-900 hover:bg-brand-800 text-white disabled:opacity-40 transition-colors"
          >
            Next Step
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
