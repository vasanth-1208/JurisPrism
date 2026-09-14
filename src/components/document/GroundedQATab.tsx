"use client";

import React, { useState, useEffect, useRef } from "react";
import { QAInteraction } from "@/types";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Quote,
  ShieldCheck,
  AlertCircle,
  Loader2,
  FileSearch,
} from "lucide-react";

interface GroundedQATabProps {
  documentId: string;
}

export default function GroundedQATab({ documentId }: GroundedQATabProps) {
  const [history, setHistory] = useState<QAInteraction[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What am I required to do?",
    "When can this agreement be terminated?",
    "What happens if I miss a payment or default?",
    "What restrictive covenants or non-compete terms exist?",
    "Which clause discusses confidentiality?",
    "What are the renewal and notice conditions?",
    "What should I ask a lawyer about?",
  ];

  useEffect(() => {
    fetch(`/api/documents/${documentId}/qa`)
      .then((res) => res.json())
      .then((data) => {
        if (data.history) setHistory(data.history);
      })
      .catch(() => {});
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleAsk = async (qText?: string) => {
    const q = (qText || question).trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setQuestion("");

    try {
      const res = await fetch(`/api/documents/${documentId}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get an answer.");
      }

      setHistory((prev) => [...prev, data.interaction]);
    } catch (err: any) {
      setError(err.message || "Failed to process question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Top Banner with Strict Grounding Guardrail Statement */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-slate-800">
            Strict Document Grounding Engine:
          </span>
          <span>Answers reference exact sections; unstated facts return explicit fallback.</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Zero Fabrication</span>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {history.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900">
                Ask Grounded Questions About This Document
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Every response is anchored in verified clause excerpts with clickable citations.
              </p>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(prompt)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-900 border border-slate-200 text-slate-700 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((msg) => (
          <div key={msg.id} className="space-y-3">
            {/* User Question */}
            <div className="flex items-start gap-2.5 justify-end">
              <div className="bg-brand-900 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-lg text-xs leading-relaxed shadow-sm">
                {msg.question}
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* AI Assistant Answer */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-brand-100">
                <Bot className="w-3.5 h-3.5" />
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm p-4 max-w-2xl text-xs space-y-3 shadow-sm">
                <p className="text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                  {msg.answer}
                </p>

                {/* Grounded Source Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Quote className="w-3 h-3 text-brand-600" />
                      Verified Source References:
                    </div>
                    {msg.sources.map((src, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-0.5"
                      >
                        <div className="font-semibold text-brand-900 flex items-center justify-between">
                          <span>Source: {src.section}</span>
                          {src.page && (
                            <span className="text-slate-400 font-normal">
                              Page {src.page}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 font-serif italic line-clamp-2">
                          "{src.quoteSnippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            <span>Scanning document chunks & synthesizing citations...</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Question Input Form */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question grounded in this document (e.g. 'When is notice required?')..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
}
