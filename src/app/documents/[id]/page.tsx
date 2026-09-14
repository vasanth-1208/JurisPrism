"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  DocumentMetadata,
  DocumentAnalysisSummary,
  ClauseAnalysis,
  ObligationItem,
  DecisionNavigatorStep,
  PreparationKit,
} from "@/types";
import ExecutiveSummaryTab from "@/components/document/ExecutiveSummaryTab";
import ClauseExplorerTab from "@/components/document/ClauseExplorerTab";
import AttentionMapTab from "@/components/document/AttentionMapTab";
import TimelineTab from "@/components/document/TimelineTab";
import GroundedQATab from "@/components/document/GroundedQATab";
import DecisionNavigatorTab from "@/components/document/DecisionNavigatorTab";
import PrepKitTab from "@/components/document/PrepKitTab";
import {
  FileText,
  FileSearch,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Compass,
  Award,
  ArrowLeft,
  RefreshCw,
  GitCompare,
  Download,
  Loader2,
  Trash2,
  AlertCircle,
  Scale,
} from "lucide-react";

type ActiveTab =
  | "summary"
  | "clauses"
  | "attention"
  | "timeline"
  | "qa"
  | "navigator"
  | "prepkit";

function DocumentWorkspaceContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const docId = params.id as string;
  const initialTab = (searchParams.get("tab") as ActiveTab) || "summary";

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [document, setDocument] = useState<DocumentMetadata | null>(null);
  const [summary, setSummary] = useState<DocumentAnalysisSummary | undefined>(undefined);
  const [clauses, setClauses] = useState<ClauseAnalysis[]>([]);
  const [obligations, setObligations] = useState<ObligationItem[]>([]);
  const [decisionSteps, setDecisionSteps] = useState<DecisionNavigatorStep[]>([]);
  const [prepKit, setPrepKit] = useState<PreparationKit | undefined>(undefined);

  const fetchDocumentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/documents/${docId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Document not found or access denied.");
      }

      setDocument(data.document);
      setSummary(data.summary);
      setClauses(data.clauses || []);
      setObligations(data.obligations || []);
      setDecisionSteps(data.decisionSteps || []);
      setPrepKit(data.prepKit);
    } catch (err: any) {
      setError(err.message || "Failed to load document data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (docId) fetchDocumentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);
      const res = await fetch(`/api/documents/${docId}/analyze`, { method: "POST" });
      if (!res.ok) throw new Error("Re-analysis failed");
      await fetchDocumentData();
    } catch (err) {
      console.error(err);
    } finally {
      setReanalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this document and all extracted data?")) {
      return;
    }
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          Loading legal analysis workspace...
        </p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Document Unavailable</h2>
        <p className="text-xs text-slate-500">{error}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "summary", label: "Executive Summary", icon: FileText, count: null },
    { id: "clauses", label: "Clause Breakdown", icon: FileSearch, count: clauses.length },
    { id: "attention", label: "Attention Map", icon: AlertTriangle, count: clauses.filter((c) => c.attentionLevel === "HIGH").length },
    { id: "timeline", label: "Obligation Timeline", icon: Calendar, count: obligations.length },
    { id: "qa", label: "Grounded Q&A", icon: MessageSquare, count: null },
    { id: "navigator", label: "Decision Navigator", icon: Compass, count: "6 Steps" },
    { id: "prepkit", label: "Attorney Prep Kit", icon: Award, count: null },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Document Header */}
      <div className="space-y-3 no-print">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/dashboard" className="hover:text-brand-700 flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">{document.documentType}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                {document.originalName}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-brand-50 text-brand-800 rounded-full border border-brand-200">
                {summary?.documentType || document.documentType}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{(document.fileSize / 1024).toFixed(1)} KB</span>
              <span>•</span>
              <span>{document.pageCount} page(s)</span>
              <span>•</span>
              <span>SHA-256: {document.sha256Hash.substring(0, 10)}...</span>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/compare?primaryDocId=${document.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
            </Link>

            <button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              title="Re-run AI analysis pipeline"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reanalyzing ? "animate-spin text-brand-600" : ""}`} />
              <span>Re-Analyze</span>
            </button>

            <button
              onClick={handleDelete}
              title="Permanently delete document"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <div className="border-b border-slate-200 no-print">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  isActive
                    ? "bg-brand-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-brand-800 text-amber-300"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === "summary" && (
          <ExecutiveSummaryTab document={document} summary={summary} />
        )}
        {activeTab === "clauses" && <ClauseExplorerTab clauses={clauses} />}
        {activeTab === "attention" && <AttentionMapTab clauses={clauses} />}
        {activeTab === "timeline" && <TimelineTab obligations={obligations} />}
        {activeTab === "qa" && <GroundedQATab documentId={document.id} />}
        {activeTab === "navigator" && (
          <DecisionNavigatorTab steps={decisionSteps} />
        )}
        {activeTab === "prepkit" && (
          <PrepKitTab documentId={document.id} prepKit={prepKit} />
        )}
      </div>
    </div>
  );
}

export default function DocumentWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
        </div>
      }
    >
      <DocumentWorkspaceContent />
    </Suspense>
  );
}
