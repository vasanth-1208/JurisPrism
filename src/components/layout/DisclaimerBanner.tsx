"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, X, Info } from "lucide-react";
import Link from "next/link";

export default function DisclaimerBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (isDismissed) return null;

  return (
    <>
      <aside aria-label="Legal Information Disclaimer" className="bg-amber-500/10 border-b border-amber-500/20 text-amber-950 px-4 py-2 text-xs transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px] shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              LEGAL NOTICE
            </span>
            <span className="hidden sm:inline text-amber-900">
              JurisPrism provides AI-powered document intelligence and attorney-preparation tools for <strong>informational purposes only</strong>. It does not replace a licensed lawyer or constitute legal representation.
            </span>
            <span className="sm:hidden text-amber-900">
              Legal information only. Not formal legal advice.
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="underline font-medium text-amber-900 hover:text-amber-950 ml-1 inline-flex items-center gap-0.5"
            >
              Learn more
            </button>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss banner"
            className="text-amber-800 hover:text-amber-950 p-1 rounded hover:bg-amber-200/50"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Scope of Assistance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                Scope of Assistance & Safety Boundary
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-slate-600 text-sm space-y-3">
              <p>
                <strong>JurisPrism</strong> is engineered to deconstruct complex contracts, highlight key obligations, and formulate sharp questions for professional counsel.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex items-start gap-2 text-emerald-800">
                  <span className="font-bold">✓ What JurisPrism Does:</span>
                  <span>Simplifies legalese, extracts timelines, maps clauses to attention levels, and generates structured attorney briefing kits.</span>
                </div>
                <div className="flex items-start gap-2 text-rose-800">
                  <span className="font-bold">✗ What JurisPrism Never Does:</span>
                  <span>Does not give definitive legal advice, guarantee legal outcomes, advise you to execute or breach a contract, or establish an attorney-client relationship.</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Laws vary significantly by state and country. Always seek the advice of a qualified, licensed attorney in your jurisdiction for any binding legal matters.
              </p>
            </div>
            <div className="mt-6 flex justify-between items-center pt-3 border-t border-slate-100">
              <Link
                href="/disclaimer"
                onClick={() => setShowModal(false)}
                className="text-xs text-brand-600 hover:underline font-medium"
              >
                Read Full Legal Disclaimer
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="bg-brand-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
