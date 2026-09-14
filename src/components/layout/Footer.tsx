import React from "react";
import Link from "next/link";
import { Scale, ShieldCheck, Lock, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded bg-brand-700 text-amber-400 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-base tracking-tight">JurisPrism</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              Empowering individuals and business leaders to deconstruct complex contracts, illuminate risk exposures, understand timelines, and prepare strategically for legal counsel.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Isolated Data Vault
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-400" /> Prompt Injection Protected
              </span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link href="/documents/upload" className="hover:text-white transition-colors">
                  Upload & Analyze
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Structural Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust, Safety & Legal */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 tracking-wide uppercase text-[11px]">
              Trust & Ethics
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/disclaimer" className="hover:text-amber-400 transition-colors font-medium">
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy & Data Handling
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 max-w-3xl">
            <strong>MANDATORY DISCLAIMER:</strong> JurisPrism is an AI-driven legal document comprehension platform that provides legal information and consultation preparation materials. JurisPrism does not provide formal legal advice, representation, attorney-client privilege, or guarantees of judicial outcomes. Always review critical contracts with an attorney licensed in your jurisdiction.
          </p>
          <div className="text-[11px] text-slate-500 shrink-0">
            © {new Date().getFullYear()} JurisPrism. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
