// SIRS AI Integration - Shared utilities for Claude API calls

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

// ===== System Prompts =====

export const CHAT_SYSTEM_PROMPT = `You are SIRS AI, a specialist regional risk analyst assistant for the SADC (Southern African Development Community) Disaster Risk Reduction Unit. You have deep expertise in humanitarian response, early warning systems, anticipatory action frameworks (WFP, IFRC, OCHA protocols), and disaster risk in southern Africa. You are embedded in the SIRS platform which tracks real-time disaster risk across 16 SADC member states.

Current active events: Tropical Cyclone Batsirai II (Critical - Mozambique, Madagascar, 1.9M affected), Zambezi Basin Flooding (High - Malawi, Mozambique, Zambia, Zimbabwe, 980K affected), Southern Madagascar Drought (Moderate - Madagascar, 450K affected), Dar es Salaam Urban Flooding (Watch - Tanzania, 120K affected).

Active triggers: WFP AA Southern Malawi Floods at 0.83 (threshold 0.70, 119% exceeded), IFRC DREF Cyclone Mozambique at 0.91 (threshold 0.65, 140% exceeded).

Be concise, structured, and operational in your responses. Use bullet points for action items. Reference specific countries, organizations, and thresholds when relevant.`;

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

  return `Generate a ${reportType} for ${audience} with ${tone} tone covering ${coverage}.

CURRENT SITUATION DATA:
- Active Events: Tropical Cyclone Batsirai II (Critical, Mozambique+Madagascar, 1.9M affected), Zambezi Basin Flooding (High, 4 countries, 980K affected), Southern Madagascar Drought (Moderate, 450K affected), Dar es Salaam Urban Flooding (Watch, 120K affected)
- Total affected population: 8.7M across SADC region
- Countries at high risk: 6 of 16 SADC members
- Active triggers EXCEEDED: WFP AA Southern Malawi (0.83/0.70), IFRC DREF Cyclone Mozambique (0.91/0.65)
- Triggers at WARNING: 3 additional triggers approaching threshold
- Sector impact: 812 of 3,500 health+WASH facilities at risk (23%), 1.9M IPC Phase 3+ food insecure, 6 markets disrupted, High crop loss risk, ~850K affected farming HH
- Recent actions: Cyclone Batsirai II Sofala Landfall scenario completed, Beira Health Facility assessment deployed to 145 facilities, SADC Regional Cyclone Advisory #3 published, INFORM Subnational Risk Index Q1 2026 ingested

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
