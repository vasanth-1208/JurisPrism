"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { DEMO_CONTRACTS } from "@/lib/demo/contracts";

type ProcessStage = "idle" | "uploading" | "extracting" | "analyzing" | "ready" | "error";

export default function DropZone() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stage, setStage] = useState<ProcessStage>("idle");
  const [stageMessage, setStageMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingDemoId, setLoadingDemoId] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    const ext = file.name.toLowerCase().split(".").pop();
    if (!["pdf", "docx", "txt"].includes(ext || "")) {
      return "Unsupported file format. Please upload a PDF, DOCX, or TXT legal document.";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "File size exceeds 10MB limit. Please upload a smaller document.";
    }
    return null;
  };

  const processFileUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setStage("error");
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    setStage("uploading");
    setStageMessage("Encrypting & uploading document to isolated vault...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Transition through meaningful processing states
      setTimeout(() => {
        setStage("extracting");
        setStageMessage("Extracting text layers, structure, and section boundaries...");
      }, 700);

      setTimeout(() => {
        setStage("analyzing");
        setStageMessage("AI identifying clauses, assessing obligations, and generating decision matrix...");
      }, 1500);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process document");
      }

      setStage("ready");
      setStageMessage("Analysis complete! Preparing workspace...");

      setTimeout(() => {
        router.push(`/documents/${data.document.id}`);
      }, 600);
    } catch (err: any) {
      setStage("error");
      setErrorMessage(err.message || "An error occurred during document processing.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileUpload(e.target.files[0]);
    }
  };

  const handleLoadDemoContract = async (demoId: string) => {
    try {
      setLoadingDemoId(demoId);
      setErrorMessage(null);
      setStage("uploading");
      setStageMessage("Loading verified sample legal contract...");

      setTimeout(() => {
        setStage("extracting");
        setStageMessage("Parsing clauses, recitals, and defined terms...");
      }, 500);

      setTimeout(() => {
        setStage("analyzing");
        setStageMessage("Running structural risk mapping and obligation timeline...");
      }, 1100);

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load demo document");
      }

      setStage("ready");
      setStageMessage("Document loaded! Opening workspace...");
      setTimeout(() => {
        router.push(`/documents/${data.document.id}`);
      }, 500);
    } catch (err: any) {
      setStage("error");
      setErrorMessage(err.message || "Failed to load sample contract.");
    } finally {
      setLoadingDemoId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* File Dropzone Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => stage === "idle" && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-brand-500 bg-brand-50/50 scale-[1.01]"
            : "border-slate-300 hover:border-brand-400 bg-white hover:bg-slate-50/50"
        } ${stage !== "idle" ? "pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload-input"
        />

        {stage === "idle" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Upload your legal document
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Drag and drop your agreement here, or click to browse files from your computer.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">PDF</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">DOCX</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">TXT</span>
              <span>• Maximum file size: 10MB</span>
            </div>
          </div>
        )}

        {/* Processing State Indicator */}
        {(stage === "uploading" || stage === "extracting" || stage === "analyzing" || stage === "ready") && (
          <div className="flex flex-col items-center justify-center space-y-5 py-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-brand-600 animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 max-w-md">
              <div className="text-xs uppercase tracking-wider font-semibold text-brand-700">
                {stage === "uploading" && "Stage 1: Secure Ingestion"}
                {stage === "extracting" && "Stage 2: Structural Extraction"}
                {stage === "analyzing" && "Stage 3: AI Legal Analysis"}
                {stage === "ready" && "Stage 4: Workspace Assembly"}
              </div>
              <p className="text-sm font-medium text-slate-700">{stageMessage}</p>
            </div>

            {/* Stage Progress Pills */}
            <div className="flex items-center gap-2 pt-2">
              <span className={`h-1.5 w-10 rounded-full transition-all ${stage === "uploading" || stage === "extracting" || stage === "analyzing" || stage === "ready" ? "bg-brand-600" : "bg-slate-200"}`} />
              <span className={`h-1.5 w-10 rounded-full transition-all ${stage === "extracting" || stage === "analyzing" || stage === "ready" ? "bg-brand-600" : "bg-slate-200"}`} />
              <span className={`h-1.5 w-10 rounded-full transition-all ${stage === "analyzing" || stage === "ready" ? "bg-brand-600" : "bg-slate-200"}`} />
              <span className={`h-1.5 w-10 rounded-full transition-all ${stage === "ready" ? "bg-emerald-500" : "bg-slate-200"}`} />
            </div>
          </div>
        )}

        {/* Error State */}
        {stage === "error" && (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-base font-semibold text-slate-900">Document Ingestion Failed</h4>
              <p className="text-sm text-rose-600">{errorMessage}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStage("idle");
                setErrorMessage(null);
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Pre-loaded Sample Contracts for 1-Click Evaluation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h4 className="font-semibold text-sm text-slate-900">
              Try Instantly with Sample Contracts
            </h4>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
              Demo Document
            </span>
          </div>
          <span className="text-xs text-slate-400">1-click automated ingestion</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_CONTRACTS.filter((c) => c.id !== "demo-employment-redline").map((contract) => (
            <div
              key={contract.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-brand-300 transition-all group"
            >
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {contract.category}
                  </span>
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                </div>
                <h5 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-brand-900">
                  {contract.title}
                </h5>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {contract.description}
                </p>
              </div>

              <button
                onClick={() => handleLoadDemoContract(contract.id)}
                disabled={loadingDemoId !== null || stage !== "idle"}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-brand-900 hover:text-white border border-slate-200 hover:border-brand-900 text-slate-700 text-xs font-medium rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {loadingDemoId === contract.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load & Analyze</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
