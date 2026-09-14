import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900">404 - Page Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The legal document, comparison matrix, or page you are seeking does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-lg shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
