"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DocumentMetadata, ObligationItem } from "@/types";
import MetricsCards from "@/components/dashboard/MetricsCards";
import ObligationAlertsWidget from "@/components/dashboard/ObligationAlertsWidget";
import RecentDocsList from "@/components/dashboard/RecentDocsList";
import {
  UploadCloud,
  Sparkles,
  GitCompare,
  Plus,
  Loader2,
  FileText,
  ShieldCheck,
  Scale,
} from "lucide-react";

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [obligations, setObligations] = useState<ObligationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Session check
      const authRes = await fetch("/api/auth/me");
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.authenticated) {
          setUser(authData.user);
        }
      }

      // 2. Fetch user's documents
      const docsRes = await fetch("/api/documents");
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents || []);

        // Aggregate obligations from first few docs if available
        if (docsData.documents?.length > 0) {
          const docId = docsData.documents[0].id;
          const detailRes = await fetch(`/api/documents/${docId}`);
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            if (detailData.obligations) {
              setObligations(detailData.obligations);
            }
          }
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDocumentDeleted = (deletedId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== deletedId));
  };

  const handleSeedDemoContracts = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/demo", { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Scale className="w-4 h-4 text-brand-600" />
            Legal Intelligence Workspace
          </div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">
            Welcome, {user?.name || "Legal Reviewer"}
          </h1>
          <p className="text-xs text-slate-500">
            Isolated tenant storage • Deconstructed clauses & attorney preparation dossiers
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {documents.length === 0 && (
            <button
              onClick={handleSeedDemoContracts}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Load 3 Sample Contracts</span>
            </button>
          )}

          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Agreements</span>
          </Link>

          <Link
            href="/documents/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading intelligence vault...</p>
        </div>
      ) : (
        <>
          {/* Metrics Overview */}
          <MetricsCards
            totalDocuments={documents.length}
            highAttentionCount={documents.length > 0 ? 3 : 0}
            upcomingDeadlinesCount={obligations.length}
            prepKitsCount={documents.length}
          />

          {/* Main 2-Column Grid: Recent Documents & Upcoming Obligations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <RecentDocsList
                documents={documents}
                onDocumentDeleted={handleDocumentDeleted}
              />
            </div>

            <div className="space-y-6">
              <ObligationAlertsWidget obligations={obligations} />

              {/* Quick Guide Card */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-xl space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  JurisPrism Guarantee
                </div>
                <h4 className="font-bold text-sm">Strict Grounding</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every answer and summary point references exact section headers. What cannot be established is explicitly marked as "Not found in document".
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
