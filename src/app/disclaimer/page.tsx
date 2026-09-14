import React from "react";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, Scale, ArrowLeft, BookOpen } from "lucide-react";

export default function LegalDisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Mandatory Regulatory & Professional Notice</span>
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">
          Legal Information Disclaimer & Scope of Platform
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 2024 • JurisPrism Ethical Safety Guidelines
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            1. No Legal Advice or Representation
          </h2>
          <p>
            <strong>JurisPrism</strong> is an artificial intelligence-powered software platform developed exclusively for <strong>informational, educational, and legal-preparation purposes</strong>. JurisPrism is not a law firm, does not engage in the practice of law, does not provide formal legal advice, and does not establish an attorney-client relationship between you and JurisPrism, its developers, or its affiliates.
          </p>
          <p>
            Nothing provided on this website—including executive summaries, clause translations, risk scoring, obligation timelines, structural comparisons, Decision Navigator flows, or Attorney Preparation Kits—should be construed as, or relied upon as, formal legal opinions, legal counsel, or guarantees of judicial outcome.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            2. Limitations of Artificial Intelligence
          </h2>
          <p>
            While JurisPrism implements state-of-the-art Generative AI and strict verification layers designed to prevent fabrication and ground all answers in uploaded documents, automated models may occasionally produce interpretations that do not capture every nuance of applicable statutory law, judicial precedent, or localized jurisdiction rules.
          </p>
          <p>
            Contract law varies extensively across state and national borders. What may be customary or enforceable in New York may be completely void under California Business and Professions Code or European civil law frameworks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            3. Decision Navigator Principles
          </h2>
          <p>
            The <em>Decision Navigator</em> feature is engineered specifically to help you organize your thoughts, identify unstated terms, and formulate specific inquiries for a licensed attorney. It will NEVER advise you to execute an agreement, refuse an agreement, or breach an obligation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            4. Mandatory Professional Consultation
          </h2>
          <p>
            You should never sign, modify, or terminate any legally binding contract or waive any legal rights without first consulting an attorney licensed to practice law in your jurisdiction who has thoroughly reviewed the complete agreement in the context of your specific personal or commercial circumstances.
          </p>
        </section>
      </div>
    </div>
  );
}
