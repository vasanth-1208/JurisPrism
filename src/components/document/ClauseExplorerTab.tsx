"use client";

import React, { useState } from "react";
import { ClauseAnalysis, ClauseCategory, AttentionLevel } from "@/types";
import AttentionBadge from "@/components/ui/AttentionBadge";
import {
  FileText,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Search,
  Quote,
  Filter,
} from "lucide-react";

interface ClauseExplorerTabProps {
  clauses: ClauseAnalysis[];
}

export default function ClauseExplorerTab({ clauses }: ClauseExplorerTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedAttention, setSelectedAttention] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { value: "ALL", label: "All Categories" },
    { value: "RESTRICTIVE_COVENANTS", label: "Restrictive Covenants" },
    { value: "LIABILITY_AND_INDEMNIFICATION", label: "Liability & Indemnity" },
    { value: "TERMINATION", label: "Termination" },
    { value: "FINANCIAL_AND_PAYMENT", label: "Financial & Compensation" },
    { value: "INTELLECTUAL_PROPERTY", label: "Intellectual Property" },
    { value: "CONFIDENTIALITY", label: "Confidentiality" },
    { value: "DISPUTE_RESOLUTION", label: "Dispute & Jurisdiction" },
  ];

  const filteredClauses = clauses.filter((c) => {
    if (selectedCategory !== "ALL" && c.category !== selectedCategory) return false;
    if (selectedAttention !== "ALL" && c.attentionLevel !== selectedAttention) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.plainExplanation.toLowerCase().includes(q) ||
        c.originalText.toLowerCase().includes(q) ||
        c.potentialConcern.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clause titles or terms..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Attention:</span>
            <select
              value={selectedAttention}
              onChange={(e) => setSelectedAttention(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Levels</option>
              <option value="HIGH">High Attention</option>
              <option value="MEDIUM">Medium Attention</option>
              <option value="LOW">Low Attention</option>
              <option value="INFORMATIONAL">Informational</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clause Cards List */}
      {filteredClauses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-sm text-slate-500">No clauses match the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredClauses.map((clause) => (
            <div
              key={clause.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    {clause.sectionNumber || "Clause"}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{clause.title}</h4>
                </div>
                <AttentionBadge level={clause.attentionLevel} size="sm" />
              </div>

              <div className="p-6 space-y-5">
                {/* 1. Original Clause Text */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Quote className="w-3.5 h-3.5 text-slate-400" />
                    Exact Document Clause Text
                  </div>
                  <p className="text-xs text-slate-800 font-serif italic leading-relaxed whitespace-pre-line">
                    "{clause.originalText}"
                  </p>
                </div>

                {/* 2. Plain Language Explanation */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-brand-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-600" />
                    Plain-Language Explanation
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {clause.plainExplanation}
                  </p>
                </div>

                {/* 3-Column Analysis Grid: Why It Matters | Potential Concern | Question for Lawyer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Why It Matters */}
                  <div className="p-3.5 rounded-lg bg-sky-50/60 border border-sky-100 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-sky-800 uppercase tracking-wider">
                      <Lightbulb className="w-3.5 h-3.5 text-sky-600" />
                      Why It Matters
                    </div>
                    <p className="text-xs text-sky-950 leading-relaxed">
                      {clause.whyItMatters}
                    </p>
                  </div>

                  {/* Potential Concern */}
                  <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-100 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Potential Concern
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      {clause.potentialConcern}
                    </p>
                  </div>

                  {/* Suggested Question for Professional */}
                  <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-800 uppercase tracking-wider">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                      Question for a Lawyer
                    </div>
                    <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                      "{clause.suggestedQuestion}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
