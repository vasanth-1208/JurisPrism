import React from "react";
import Link from "next/link";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy & Data Protection Architecture</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">
          Privacy Policy & Security Model
        </h1>
        <p className="text-xs text-slate-500">
          How your uploaded legal contracts are isolated, processed, and purged.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            1. Multi-Tenant Data Isolation
          </h2>
          <p>
            Your uploaded legal contracts and all derived analyses, extracted clauses, obligation timelines, and Q&A interactions are strictly tied to your authenticated session ID. Cross-user access is impossible; our database and API layer enforce strict tenant boundaries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            2. Prompt Injection Defense & Data Boundaries
          </h2>
          <p>
            Uploaded legal documents may contain adversarial text or malicious jailbreak attempts. In JurisPrism, document text is treated strictly as passive DATA inside isolated delimiter envelopes. It is never executed or evaluated as system instructions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            3. Right to Complete Deletion
          </h2>
          <p>
            You maintain full sovereignty over your documents. When you click "Delete" in the dashboard or document workspace, the physical file, its extracted chunks, analysis records, obligation timelines, and Q&A history are permanently deleted from disk and memory.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            4. Third-Party GenAI Handling
          </h2>
          <p>
            When utilizing Google Gemini GenAI, data sent through enterprise APIs is not used to train public foundation models in compliance with standard cloud security commitments. If offline deterministic mode is active, zero external network requests are made.
          </p>
        </section>
      </div>
    </div>
  );
}
