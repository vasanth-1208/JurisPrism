import React from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  FileSearch,
  Compass,
  GitCompare,
  Calendar,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Plain-Language Translation",
      description: "Deconstruct dense legalese into clear, 3-tiered explanations: 2-minute executive synthesis, plain-English walkthrough, and clause-by-clause rationale.",
      icon: FileSearch,
      badge: "Comprehension",
    },
    {
      title: "Legal Attention Heatmap",
      description: "Objective risk categorization across High, Medium, Low, and Informational tiers. Identifies one-sided indemnities, broad waivers, and non-compete covenants.",
      icon: AlertTriangle,
      badge: "Risk Detection",
    },
    {
      title: "Obligation & Deadline Timeline",
      description: "Extracts notice windows, renewal cliffs, and payment schedules while preserving literal relative conditions to avoid hallucinated calendar dates.",
      icon: Calendar,
      badge: "Deadlines",
    },
    {
      title: "Grounded Q&A with Citations",
      description: "Ask natural-language questions anchored strictly in your document text. Every answer includes verified section citations with zero hallucinations.",
      icon: ShieldCheck,
      badge: "Zero-Hallucination",
    },
    {
      title: "Structural Document Comparison",
      description: "Compare two agreements side-by-side to illuminate added, deleted, and modified clauses, shifting financial terms, and liability balance changes.",
      icon: GitCompare,
      badge: "Diff Matrix",
    },
    {
      title: "The Decision Navigator",
      description: "Proprietary 6-step guided decision preparation flow. Never gives dangerous 'Sign this' advice—prepares you strategically for your legal consultation.",
      icon: Compass,
      badge: "Differentiator",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Secure Document Ingestion",
      desc: "Upload PDF, DOCX, or TXT contracts into isolated client storage vaults protected against prompt-injection attacks.",
    },
    {
      step: "02",
      title: "Structural Decomposition",
      desc: "AI identifies recitals, parties, defined terms, and extracts 12 core clause categories without hallucinating missing provisions.",
    },
    {
      step: "03",
      title: "Risk Mapping & Timeline",
      desc: "System compiles high-attention alerts, calculates notice windows, and constructs chronological obligation roadmaps.",
    },
    {
      step: "04",
      title: "Attorney Preparation Kit",
      desc: "Generate an 8-point briefing dossier with targeted questions to minimize lawyer billable hours and protect your interests.",
    },
  ];

  const faqs = [
    {
      q: "Does JurisPrism replace a licensed attorney?",
      a: "No. JurisPrism is strictly an AI-powered legal document intelligence and decision preparation platform. It provides legal information, structural deconstruction, and attorney-briefing packages. It never provides formal legal advice, representation, or legal guarantees.",
    },
    {
      q: "How does JurisPrism prevent AI hallucinations?",
      a: "JurisPrism operates under strict anti-hallucination protocols: every clause citation must match source text, absent terms are explicitly marked 'Not found in document', and Q&A answers without document evidence return an explicit fallback message.",
    },
    {
      q: "Are my uploaded legal documents kept private and secure?",
      a: "Yes. Documents are processed in isolated per-user vaults with SHA-256 integrity verification. Uploaded text is treated strictly as passive data inside delimited containers, preventing prompt-injection attacks. You can permanently wipe your documents at any time.",
    },
    {
      q: "Can I test the platform without uploading my own contracts?",
      a: "Yes! JurisPrism includes 1-Click Demo Access pre-loaded with realistic, verified legal agreements (Employment Agreement, Commercial Lease, and Mutual NDA) so you can evaluate all features immediately.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-900 text-xs font-semibold shadow-sm">
            <Scale className="w-3.5 h-3.5 text-brand-600" />
            <span>AI for Legal Assistance & Access • Trusted Document Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-slate-900 tracking-tight leading-[1.15]">
            Understand Every Clause. <br />
            <span className="bg-gradient-to-r from-brand-800 via-brand-600 to-indigo-700 bg-clip-text text-transparent">
              Prepare for Every Decision.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform dense, intimidating legal agreements into plain language, illuminated risk maps, chronological obligation timelines, and structured attorney-briefing kits.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/documents/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Upload Document</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore 1-Click Live Demo</span>
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PDF, DOCX, TXT Supported
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand-600" /> Isolated Client Vaults
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Grounded Citations
            </span>
          </div>
        </div>

        {/* Visual Product Mockup Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                Executive Employment Agreement • Legal Attention Map
              </span>
            </div>
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              Verified Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">1. Original Legalese</span>
                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">Section 5.1</span>
              </div>
              <p className="text-xs text-slate-600 font-serif italic line-clamp-3">
                "Employee shall not directly or indirectly engage in, perform services for, or assist any entity competing with Company for twelve (12) months..."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-900">2. Plain-English Impact</span>
                <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded">Translation</span>
              </div>
              <p className="text-xs text-slate-700 line-clamp-3">
                Bars you from working for competitors for 1 full year nationwide. In California, non-competes are generally unenforceable under Bus. & Prof. Code § 16600.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-900">3. Attention & Action</span>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">High Attention</span>
              </div>
              <p className="text-xs text-rose-950 font-medium line-clamp-3">
                "Suggested Question for Counsel: Can we strike Section 5.1 entirely or limit the geographical radius and definition of competing products?"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <h2 className="text-xs font-bold text-brand-700 uppercase tracking-wider">
            Engineered for High-Stakes Documents
          </h2>
          <h3 className="text-3xl font-bold font-serif text-slate-900">
            A Serious Legal Intelligence Platform
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Not a generic chatbot. A multi-stage analysis pipeline built around real legal workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {feat.badge}
                  </span>
                </div>
                <h4 className="font-bold text-base text-slate-900">{feat.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step User Journey Workflow */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-14">
        <div className="max-w-3xl mb-12 space-y-2">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
            The Analysis Workflow
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif">
            How JurisPrism Guides You from Upload to Action
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            A transparent 4-stage pipeline that ensures total document comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="space-y-3 relative">
              <div className="text-3xl font-bold font-mono text-slate-700">{step.step}</div>
              <h4 className="font-bold text-sm text-white">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety Principles */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Zero Fabrications</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If a clause or governing condition is absent, the system states "Not found in document". It will never invent dates or cite fake statutes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Prompt-Injection Defense</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Uploaded text is treated strictly as passive data inside isolated containers. Embedded jailbreak instructions inside contracts cannot override system behavior.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Decision Navigator</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never tell you "Sign this" or "Do not sign". We illuminate what to clarify and what questions to pose to your legal professional.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold font-serif text-slate-900">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-500">
            Key insights on legal technology, trust boundaries, and platform capabilities.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold font-serif">
            Ready to Deconstruct Your Legal Document?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Gain immediate clarity on obligations, critical dates, and areas to review before speaking with counsel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/documents/upload"
              className="w-full sm:w-auto px-6 py-3 bg-white text-brand-950 hover:bg-slate-100 text-xs font-bold rounded-xl shadow transition-colors"
            >
              Upload Document Now
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              1-Click Instant Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
