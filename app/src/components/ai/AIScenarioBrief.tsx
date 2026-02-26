"use client";

import { useState, useCallback } from "react";
import { Sparkles, Copy, RefreshCw, ChevronDown, ChevronUp, Check } from "lucide-react";
import {
  callSIRSAI,
  buildScenarioBriefPrompt,
  SCENARIO_BRIEF_SYSTEM_PROMPT,
} from "@/lib/ai";

interface AIScenarioBriefProps {
  name: string;
  type: string;
  status: string;
  affectedPop: number;
  facilities: number;
  countries: string[];
  createdBy: string;
  date: string;
}

export default function AIScenarioBrief({
  name,
  type,
  status,
  affectedPop,
  facilities,
  countries,
  createdBy,
  date,
}: AIScenarioBriefProps) {
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateBrief = useCallback(async () => {
    setLoading(true);
    setError(null);
    setExpanded(true);

    const prompt = buildScenarioBriefPrompt(
      name,
      type,
      status,
      affectedPop,
      facilities,
      countries,
      createdBy,
      date,
    );

    const result = await callSIRSAI({
      messages: [{ role: "user", content: prompt }],
      systemPrompt: SCENARIO_BRIEF_SYSTEM_PROMPT,
      maxTokens: 512,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setBrief(result.content);
    }

    setLoading(false);
  }, [name, type, status, affectedPop, facilities, countries, createdBy, date]);

  const handleToggle = () => {
    if (!brief && !loading && !error) {
      generateBrief();
    } else {
      setExpanded((prev) => !prev);
    }
  };

  const handleCopy = async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silent fail
    }
  };

  const handleRegenerate = () => {
    generateBrief();
  };

  return (
    <div className="mt-3 border-t border-slate-700/40 pt-3">
      {/* Toggle button */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-slate-700/40 disabled:opacity-60 disabled:cursor-wait text-purple-400 hover:text-purple-300"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          AI Brief
        </span>
        {loading ? (
          <svg
            className="h-3.5 w-3.5 animate-spin text-purple-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M4 12a8 8 0 018-8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-75"
            />
          </svg>
        ) : expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-2">
          {loading && !brief && (
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/60 px-3 py-4 text-xs text-slate-500">
              <svg
                className="h-4 w-4 animate-spin text-purple-400/70"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              Generating scenario briefing...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs text-red-400">
              {error}
              <button
                onClick={handleRegenerate}
                className="ml-2 underline transition-colors hover:text-red-300"
              >
                Retry
              </button>
            </div>
          )}

          {brief && (
            <div className="rounded-lg border border-purple-500/15 bg-purple-500/5 px-3 py-3">
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
                {brief}
              </p>

              {/* Action buttons */}
              <div className="mt-2.5 flex items-center gap-1.5 border-t border-purple-500/10 pt-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-700/50 hover:text-slate-300"
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
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-700/50 hover:text-slate-300 disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
