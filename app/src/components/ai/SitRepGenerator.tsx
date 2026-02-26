"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  Copy,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { callSIRSAI, buildSitRepPrompt, SITREP_SYSTEM_PROMPT } from "@/lib/ai";

interface SitRepGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_TYPES = [
  "Flash Update",
  "Situation Report",
  "Weekly Bulletin",
  "Regional Overview",
];

const GEOGRAPHIC_COVERAGE = [
  "Full SADC Region",
  "Cyclone-Affected Areas",
  "Flood-Affected Areas",
  "Drought-Affected Areas",
];

const TARGET_AUDIENCES = [
  "SADC Council",
  "Humanitarian Partners",
  "Member States",
  "General Public",
];

const TONES = [
  "Formal/Diplomatic",
  "Operational/Technical",
  "Executive Summary",
  "Media-Ready",
];

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 pr-8 text-sm text-slate-200 outline-none transition-colors focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}

export default function SitRepGenerator({
  isOpen,
  onClose,
}: SitRepGeneratorProps) {
  const [reportType, setReportType] = useState(REPORT_TYPES[0]);
  const [coverage, setCoverage] = useState(GEOGRAPHIC_COVERAGE[0]);
  const [audience, setAudience] = useState(TARGET_AUDIENCES[0]);
  const [tone, setTone] = useState(TONES[0]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");
    setGeneratedReport("");

    const prompt = buildSitRepPrompt(reportType, coverage, audience, tone);

    const result = await callSIRSAI({
      messages: [{ role: "user", content: prompt }],
      systemPrompt: SITREP_SYSTEM_PROMPT,
      maxTokens: 2048,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setGeneratedReport(result.content);
    }

    setIsGenerating(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments where clipboard API is unavailable
    }
  }

  function handleDownload() {
    const blob = new Blob([generatedReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SIRS_${reportType.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleClose() {
    setGeneratedReport("");
    setError("");
    setIsGenerating(false);
    setCopied(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 ring-1 ring-violet-500/30">
              <Sparkles className="h-4.5 w-4.5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                AI SitRep Generator
              </h2>
              <p className="text-xs text-slate-500">
                Generate situation reports powered by SIRS AI
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Configuration Form */}
          {!generatedReport && !isGenerating && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Report Type"
                  value={reportType}
                  onChange={setReportType}
                  options={REPORT_TYPES}
                />
                <SelectField
                  label="Geographic Coverage"
                  value={coverage}
                  onChange={setCoverage}
                  options={GEOGRAPHIC_COVERAGE}
                />
                <SelectField
                  label="Target Audience"
                  value={audience}
                  onChange={setAudience}
                  options={TARGET_AUDIENCES}
                />
                <SelectField
                  label="Tone"
                  value={tone}
                  onChange={setTone}
                  options={TONES}
                />
              </div>

              {/* Context preview */}
              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Report Configuration
                </p>
                <p className="text-xs leading-relaxed text-slate-400">
                  A <span className="text-violet-400">{reportType}</span>{" "}
                  covering{" "}
                  <span className="text-blue-400">{coverage}</span> for{" "}
                  <span className="text-emerald-400">{audience}</span> in a{" "}
                  <span className="text-amber-400">{tone}</span> tone.
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-6">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-violet-500" />
                <Sparkles className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-violet-400" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Generating situation report...
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Analyzing current SADC data and composing{" "}
                {reportType.toLowerCase()}
              </p>
            </div>
          )}

          {/* Generated Report */}
          {generatedReport && !isGenerating && (
            <div className="space-y-4">
              {/* Report header badge */}
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-medium text-violet-400">
                  {reportType}
                </span>
                <span className="text-xs text-slate-600">|</span>
                <span className="text-xs text-slate-500">{coverage}</span>
                <span className="text-xs text-slate-600">|</span>
                <span className="text-xs text-slate-500">
                  {new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Report content */}
              <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-700/50 bg-slate-800/60 px-5 py-4">
                <div className="sitrep-content prose prose-invert prose-sm max-w-none">
                  {generatedReport.split("\n").map((line, i) => {
                    // Section headers (lines starting with ## or all-caps lines)
                    if (line.startsWith("## ") || line.startsWith("# ")) {
                      return (
                        <h3
                          key={i}
                          className="mb-2 mt-4 text-sm font-bold text-slate-100 first:mt-0"
                        >
                          {line.replace(/^#+\s*/, "")}
                        </h3>
                      );
                    }
                    // Bold sub-headers (**text**)
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <h4
                          key={i}
                          className="mb-1.5 mt-3 text-xs font-bold uppercase tracking-wider text-violet-400"
                        >
                          {line.replace(/\*\*/g, "")}
                        </h4>
                      );
                    }
                    // Bullet points
                    if (line.startsWith("- ") || line.startsWith("* ")) {
                      return (
                        <div
                          key={i}
                          className="ml-3 flex gap-2 py-0.5 text-xs leading-relaxed text-slate-300"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                          <span>{line.replace(/^[-*]\s*/, "")}</span>
                        </div>
                      );
                    }
                    // Numbered list items
                    if (/^\d+\.\s/.test(line)) {
                      return (
                        <div
                          key={i}
                          className="ml-3 flex gap-2 py-0.5 text-xs leading-relaxed text-slate-300"
                        >
                          <span className="shrink-0 font-medium text-slate-500">
                            {line.match(/^(\d+\.)/)?.[1]}
                          </span>
                          <span>{line.replace(/^\d+\.\s*/, "")}</span>
                        </div>
                      );
                    }
                    // Empty lines
                    if (line.trim() === "") {
                      return <div key={i} className="h-2" />;
                    }
                    // Regular paragraphs
                    return (
                      <p
                        key={i}
                        className="py-0.5 text-xs leading-relaxed text-slate-300"
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-700/50 px-6 py-4">
          {!generatedReport && !isGenerating && (
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/30"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate Report
              </button>
            </div>
          )}

          {generatedReport && !isGenerating && (
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-100"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-100"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-blue-500"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download as Text
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
