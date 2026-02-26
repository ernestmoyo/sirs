// SIRS AI Integration - Shared utilities for Claude API calls

import { sadcCountries, activeEvents, triggers, scenarios, recentActivities } from "@/lib/mock-data";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export async function callSIRSAI({
  messages,
  systemPrompt,
  maxTokens = 1024,
}: {
  messages: AIMessage[];
  systemPrompt: string;
  maxTokens?: number;
}): Promise<{ content: string; error?: string }> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, systemPrompt, maxTokens }),
    });

    if (!response.ok) {
      const err = await response.json();
      return { content: "", error: err.error || "AI request failed" };
    }

    const data = await response.json();
    return { content: data.content };
  } catch {
    return { content: "", error: "Failed to connect to AI service" };
  }
}

// ===== Helper: format large numbers =====

function fmtPop(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

// ===== Dynamic data summary from mock-data =====

function buildDataContext(): string {
  const totalAffected = sadcCountries.reduce((s, c) => s + c.affectedPopulation, 0);
  const highRiskCountries = sadcCountries.filter(c => c.riskScore >= 0.6);
  const redTriggers = triggers.filter(t => t.status === "red");
  const amberTriggers = triggers.filter(t => t.status === "amber");

  // Facility totals from districts
  let totalHealth = 0, healthAtRisk = 0, totalWash = 0, washAtRisk = 0, totalSchools = 0, schoolsAtRisk = 0;
  for (const c of sadcCountries) {
    for (const d of c.districts) {
      totalHealth += d.facilities.health;
      healthAtRisk += d.facilities.healthAtRisk;
      totalWash += d.facilities.wash;
      washAtRisk += d.facilities.washAtRisk;
      totalSchools += d.facilities.schools;
      schoolsAtRisk += d.facilities.schoolsAtRisk;
    }
  }

  const eventLines = activeEvents
    .map(e => `${e.name} (${e.severity}, ${e.countries.join(" + ")}, ${fmtPop(e.affectedPopulation)} affected, status: ${e.status})`)
    .join("; ");

  const redTriggerLines = redTriggers
    .map(t => `${t.name} [${t.organization}]: ${t.currentValue.toFixed(2)}/${t.threshold.toFixed(2)} (${Math.round((t.currentValue / t.threshold) * 100)}% of threshold)`)
    .join("; ");

  const amberTriggerLines = amberTriggers
    .map(t => `${t.name} [${t.organization}]: ${t.currentValue.toFixed(2)}/${t.threshold.toFixed(2)}`)
    .join("; ");

  const countryRiskSummary = sadcCountries
    .filter(c => c.riskScore >= 0.5)
    .sort((a, b) => b.riskScore - a.riskScore)
    .map(c => `${c.name}: risk ${(c.riskScore * 10).toFixed(1)}/10, ${fmtPop(c.affectedPopulation)} affected, pop ${fmtPop(c.population)}`)
    .join("; ");

  return `LIVE PLATFORM DATA:
- Total affected population across SADC: ${fmtPop(totalAffected)}
- Countries tracked: ${sadcCountries.length} SADC member states
- High-risk countries (score >= 6/10): ${highRiskCountries.length} — ${highRiskCountries.map(c => c.name).join(", ")}
- Active events (${activeEvents.length}): ${eventLines}
- Triggers EXCEEDED (${redTriggers.length}): ${redTriggerLines || "None"}
- Triggers at WARNING (${amberTriggers.length}): ${amberTriggerLines || "None"}
- Country risk summary: ${countryRiskSummary}
- Facilities at risk: ${healthAtRisk} of ${totalHealth} health, ${washAtRisk} of ${totalWash} WASH, ${schoolsAtRisk} of ${totalSchools} schools
- Active scenarios: ${scenarios.length} (${scenarios.map(s => `${s.name} [${s.status}]`).join("; ")})`;
}

// ===== System Prompts =====

export function buildChatSystemPrompt(): string {
  return `You are SIRS AI, a regional risk analyst assistant for the SADC Disaster Risk Reduction Unit. You have expertise in humanitarian response, early warning systems, and disaster risk in southern Africa.

${buildDataContext()}

RESPONSE RULES:
- Keep responses SHORT — max 3-5 bullet points or 2-3 short paragraphs
- Do NOT use markdown headers (#, ##), horizontal rules (---), or tables
- Do NOT use emoji
- Use plain text with simple bullet points (-)
- Be direct and conversational, like a colleague briefing you quickly
- Only go into detail if the user specifically asks for it
- ALWAYS use the exact numbers from LIVE PLATFORM DATA above — never make up or round differently`;
}

export const SITREP_SYSTEM_PROMPT = `You are a professional humanitarian situation report writer for the SADC Disaster Risk Reduction Unit. You write concise, factual, operational reports following OCHA SitRep conventions. Use clear section headers, specific numbers, and actionable language.`;

export const RISK_BRIEF_SYSTEM_PROMPT = `You are a concise risk analyst writing a 150-200 word country risk brief for humanitarian decision-makers. Be specific, use numbers, and end with 1-2 priority recommendations.`;

export const SCENARIO_BRIEF_SYSTEM_PROMPT = `You are a disaster scenario analyst writing operational briefings for humanitarian coordinators.`;

export function buildSitRepPrompt(
  reportType: string,
  coverage: string,
  audience: string,
  tone: string,
): string {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const recentActionLines = recentActivities
    .slice(0, 5)
    .map(a => `${a.action}: ${a.detail}`)
    .join("; ");

  return `Generate a ${reportType} for ${audience} with ${tone} tone covering ${coverage}.

${buildDataContext()}
- Recent actions: ${recentActionLines}

Format with these sections: Situation Overview, Key Figures, Priority Actions, Sector Updates, Outlook & Recommendations. Date the report ${today}.`;
}

export function buildRiskBriefPrompt(
  countryName: string,
  riskScore: number,
  hazardScore: number,
  exposureScore: number,
  vulnerabilityScore: number,
  affectedPopulation: number,
  activeAlerts: number,
  events: string,
  triggerStatus: string,
): string {
  return `Write a risk brief for ${countryName} in the SADC region.

Risk scores: Overall ${(riskScore * 10).toFixed(1)}/10, Hazard ${(hazardScore * 10).toFixed(1)}/10, Exposure ${(exposureScore * 10).toFixed(1)}/10, Vulnerability ${(vulnerabilityScore * 10).toFixed(1)}/10. Affected population: ${affectedPopulation.toLocaleString()}. Active alerts: ${activeAlerts}.
Active events affecting this country: ${events}.
Trigger status: ${triggerStatus}.`;
}

export function buildScenarioBriefPrompt(
  name: string,
  type: string,
  status: string,
  affectedPop: number,
  facilities: number,
  countries: string[],
  createdBy: string,
  date: string,
): string {
  return `Generate a 200-word operational briefing for this disaster scenario:

Name: ${name}
Type: ${type} (Cyclone/Flood/Drought)
Status: ${status}
Affected population: ${affectedPop.toLocaleString()}
Facilities at risk: ${facilities}
Countries affected: ${countries.join(", ")}
Created by: ${createdBy}
Date: ${date}

Cover: what is happening, who is affected, what the key operational challenges are, and what the 3 top priority actions are for the response team.`;
}
