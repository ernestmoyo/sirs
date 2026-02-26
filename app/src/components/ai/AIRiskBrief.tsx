"use client";

import { useState, useCallback } from "react";
import { Sparkles, Copy, RefreshCw, Check, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { callSIRSAI, buildRiskBriefPrompt, RISK_BRIEF_SYSTEM_PROMPT } from "@/lib/ai";

interface AIRiskBriefProps {
  countryName: string;
  riskScore: number;
  hazardScore: number;
  exposureScore: number;
  vulnerabilityScore: number;
  affectedPopulation: number;
  activeAlerts: number;
  events: string;
  triggerStatus: string;
}

export default function AIRiskBrief({
  countryName,
  riskScore,
  hazardScore,
  exposureScore,
  vulnerabilityScore,
  affectedPopulation,
  activeAlerts,
  events,
  triggerStatus,
}: AIRiskBriefProps) {
  const [brief, setBrief] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const generateBrief = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setBrief("");

    const prompt = buildRiskBriefPrompt(
      countryName,
      riskScore,
      hazardScore,
      exposureScore,
      vulnerabilityScore,
      affectedPopulation,
      activeAlerts,
      events,
      triggerStatus,
    );

    const result = await callSIRSAI({
      messages: [{ role: "user", content: prompt }],
      systemPrompt: RISK_BRIEF_SYSTEM_PROMPT,
      maxTokens: 512,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setBrief(result.content);
    }

    setIsLoading(false);
  }, [
    countryName,
    riskScore,
    hazardScore,
    exposureScore,
    vulnerabilityScore,
    affectedPopulation,
    activeAlerts,
    events,
    triggerStatus,
  ]);

  const handleCopy = useCallback(async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail if clipboard is unavailable
    }
  }, [brief]);

  const hasBrief = brief.length > 0;

  return (
    <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/40">
      {/* Header - collapsible toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-800/60"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/20 to-blue-500/20 ring-1 ring-violet-500/30">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            AI Risk Brief
          </span>
          {hasBrief && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
              Generated
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-500" />
        )}
      </button>

      {/* Body */}
      {isExpanded && (
        <div className="border-t border-slate-700/30 px-4 pb-4 pt-3">
          {/* Not yet generated - show generate button */}
          {!hasBrief && !isLoading && !error && (
            <div className="flex flex-col items-center gap-3 py-4">
              <p className="text-center text-xs leading-relaxed text-slate-500">
                Generate an AI-powered risk brief for{" "}
                <span className="font-medium text-slate-300">{countryName}</span>{" "}
                summarizing hazard, exposure, vulnerability, and recommended actions.
              </p>
              <button
                onClick={generateBrief}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/30 active:scale-[0.98]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Generate AI Risk Brief
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-500" />
                <Sparkles className="h-4 w-4 animate-pulse text-violet-400" />
              </div>
              <p className="text-xs text-slate-500">
                Analyzing risk profile for {countryName}...
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
              <button
                onClick={generateBrief}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:from-violet-500 hover:to-blue-500 active:scale-[0.98]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* Generated brief */}
          {hasBrief && !isLoading && (
            <div>
              {/* Brief content */}
              <div className="rounded-lg border border-slate-700/40 bg-slate-900/60 p-4">
                <div className="prose-xs text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {brief}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-600">
                  AI-generated brief -- verify before operational use
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-200"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={generateBrief}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1.5 text-[11px] font-medium text-violet-400 transition-colors hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-violet-300"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
