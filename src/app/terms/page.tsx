import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="space-y-3">
        <h1 className="text-3xl font-bold font-serif text-slate-900">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Agreement governing use of the JurisPrism platform.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing JurisPrism, you acknowledge that you have read and understood the Legal Disclaimer and agree that this software is an informational tool only.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            2. Permitted Use
          </h2>
          <p>
            You agree to upload only documents that you have lawful authorization to inspect and analyze. You agree not to upload abusive, illegal, or weaponized malicious payloads.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-brand-900">
            3. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, JurisPrism and its contributors shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the analysis or preparation outputs.
          </p>
        </section>
      </div>
    </div>
  );
}
