import { createServerFn } from "@tanstack/react-start";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const SYSTEM_PROMPT = `You are "TrustReport AI", a trusted community safety and incident verification assistant for TrustReport Ilorin.
Your mission is to help citizens, community leaders, and student observers report and verify local incidents (floods, damaged infrastructure, blocked drainage, electrical hazards, and public safety issues) with high credibility.

Rules you must always follow:
- Write clear, objective, accessible language. Use a supportive, professional tone.
- Clearly present any AI classification, summary, or credibility score as an ASSISTANCE RECOMMENDATION, NOT definitive proof.
- You do NOT have access to live sensor feeds, real-time weather radars, or direct emergency dispatch. If asked, remind the user that this is an educational prototype and recommend official emergency channels.
- Never invent emergency phone numbers, never claim you dispatched emergency services.
- Keep safety first: advise staying clear of surging floodwaters, exposed wires, and collapsing structures.
- Keep responses focused and under 150 words unless structured lists are requested.`;

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(20),
});

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function callGeminiChat(
  systemPrompt: string,
  userPrompt: string,
  history: Array<{ role: string; content: string }> = [],
): Promise<string | null> {
  const ai = getGenAI();
  if (!ai) return null;

  try {
    const contents = [
      ...history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
      })),
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    const text = response.text?.trim();
    return text || null;
  } catch (error) {
    console.error("Failed to generate chat response with Gemini API:", error);
    return null;
  }
}

export interface ReportAnalysisResult {
  category: "flooding" | "infrastructure" | "sanitation" | "utility" | "safety";
  severity: "low" | "moderate" | "high" | "critical";
  confidence: "low" | "medium" | "high";
  credibilityRating: number; // 0 - 100%
  why: string;
  action: string;
  suggestedAgency: string;
  missing: string[];
  source?: "gemini" | "rule_based_fallback";
}

async function callGeminiAnalysis(
  systemPrompt: string,
  userPrompt: string,
): Promise<ReportAnalysisResult | null> {
  const ai = getGenAI();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "Must be one of: flooding, infrastructure, sanitation, utility, safety",
            },
            severity: {
              type: Type.STRING,
              description: "Must be one of: low, moderate, high, critical",
            },
            confidence: {
              type: Type.STRING,
              description: "Must be one of: low, medium, high",
            },
            credibilityRating: {
              type: Type.INTEGER,
              description: "Estimated data completeness score from 30 to 95",
            },
            why: {
              type: Type.STRING,
              description:
                "2-3 short sentences explaining the severity and category classification",
            },
            action: {
              type: Type.STRING,
              description: "2-3 practical safety suggestions for residents",
            },
            suggestedAgency: {
              type: Type.STRING,
              description:
                "Relevant Kwara State agency (e.g., Fire Service, KWEPA, Ministry of Works, IBEDC)",
            },
            missing: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of missing details to improve verification",
            },
          },
          required: [
            "category",
            "severity",
            "confidence",
            "credibilityRating",
            "why",
            "action",
            "suggestedAgency",
            "missing",
          ],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) return null;

    return JSON.parse(text) as ReportAnalysisResult;
  } catch (error) {
    console.error("Failed to generate report analysis with Gemini API:", error);
    return null;
  }
}

function generateOfflineChatReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (
    lower.includes("wire") ||
    lower.includes("electric") ||
    lower.includes("shock") ||
    lower.includes("cable")
  ) {
    return "⚡ Electrical Hazard Warning: Stay at least 10 meters away from fallen wires or flooded transformers. Do not touch fences or metal gates in contact with standing water. Report immediately so IBEDC and local safety officers can isolate the power line. 🛑";
  }

  if (
    lower.includes("culvert") ||
    lower.includes("drain") ||
    lower.includes("gutter") ||
    lower.includes("waste")
  ) {
    return "🗑️ Blocked Drainage Advisory: When drains choke with PET bottles and silt, stormwater backs up into roads and homes. Document the location and report it under Sanitation & Drainage so community cleanup squads and KWEPA can intervene. 🧹";
  }

  if (
    lower.includes("bridge") ||
    lower.includes("road") ||
    lower.includes("collapse") ||
    lower.includes("crack")
  ) {
    return "🏗️ Infrastructure Hazard: If asphalt or bridge foundations show erosion or cracking, keep vehicles and pedestrians back. Report under Infrastructure with photos so transport authorities can flag the detour route. 🚧";
  }

  if (lower.includes("tanke") || (lower.includes("car") && lower.includes("water"))) {
    return "⚠️ High-Risk Water Crossing: Around Tanke and University Road, rapid runoff can submerge low sedans. Remember: 15cm of flowing water can knock down a walker, and 30cm can float cars. Turn around and seek higher ground! 🚗💧";
  }

  if (lower.includes("verify") || lower.includes("credibility") || lower.includes("trust")) {
    return "🔍 Verification on TrustReport: Every report begins as Submitted. It reaches Community Confirmed when 3+ local residents affirm the observation, or Field Verified when a local civil observer conducts on-ground checks. Transparent audit logs ensure information you can trust! 🛡️";
  }

  return "👋 Hello! I am TrustReport AI. I assist in evaluating community incidents, assessing flood and hazard severity, checking report credibility, and recommending emergency safety steps for Ilorin. How can I help you today? 🛡️✨";
}

function generateOfflineAnalysis(
  desc: string,
  hasPhoto: boolean,
  hasDepth: boolean,
  hasLocation: boolean,
): ReportAnalysisResult {
  const lower = desc.toLowerCase();
  let category: "flooding" | "infrastructure" | "sanitation" | "utility" | "safety" = "flooding";
  let severity: "low" | "moderate" | "high" | "critical" = "moderate";
  let confidence: "low" | "medium" | "high" = "medium";
  let suggestedAgency = "Kwara State Emergency Services";

  // Category detection
  if (
    lower.includes("wire") ||
    lower.includes("cable") ||
    lower.includes("electric") ||
    lower.includes("transformer") ||
    lower.includes("power outage")
  ) {
    category = "utility";
    suggestedAgency = "IBEDC Emergency Dispatch";
  } else if (
    lower.includes("culvert") ||
    lower.includes("drain") ||
    lower.includes("refuse") ||
    lower.includes("trash") ||
    lower.includes("gutter") ||
    lower.includes("plastic")
  ) {
    category = "sanitation";
    suggestedAgency = "KWEPA (Kwara Environmental Protection Agency)";
  } else if (
    lower.includes("bridge") ||
    lower.includes("gully") ||
    lower.includes("collapsed") ||
    lower.includes("asphalt") ||
    lower.includes("pothole") ||
    lower.includes("erosion")
  ) {
    category = "infrastructure";
    suggestedAgency = "Kwara State Ministry of Works & Transport";
  } else if (
    lower.includes("pit") ||
    lower.includes("hazard") ||
    lower.includes("school") ||
    lower.includes("open drain")
  ) {
    category = "safety";
    suggestedAgency = "Civil Defence Corps / Neighborhood Watch";
  } else {
    category = "flooding";
    suggestedAgency = "Kwara State Fire and Emergency Services";
  }

  // Severity detection
  if (
    lower.includes("roof") ||
    lower.includes("submerged") ||
    lower.includes("trap") ||
    lower.includes("inside home") ||
    lower.includes("live wire") ||
    lower.includes("collapsed bridge") ||
    lower.includes("waist")
  ) {
    severity = "critical";
    confidence = "high";
  } else if (
    lower.includes("knee") ||
    lower.includes("cannot pass") ||
    lower.includes("stalled") ||
    lower.includes("fast moving") ||
    lower.includes("overflow")
  ) {
    severity = "high";
    confidence = "high";
  } else if (
    lower.includes("ankle") ||
    lower.includes("ponding") ||
    lower.includes("slow moving") ||
    lower.includes("gutter full")
  ) {
    severity = "moderate";
    confidence = "medium";
  } else {
    severity = "low";
    confidence = "low";
  }

  let credibilityRating = 50;
  if (hasLocation) credibilityRating += 15;
  if (hasPhoto) credibilityRating += 20;
  if (hasDepth || desc.length > 50) credibilityRating += 10;

  const missing: string[] = [];
  if (!hasLocation) missing.push("Precise street or landmark name in Ilorin");
  if (!hasPhoto) missing.push("Photo evidence taken from safe vantage point");
  if (!hasDepth && category === "flooding")
    missing.push("Estimated water depth (ankle, knee, waist)");

  const why = `This observation indicates a ${severity} ${category} issue based on reported hazards and physical obstacles.`;
  let action =
    "Keep a safe distance, alert neighbors in the immediate vicinity, and monitor official guidance.";

  if (severity === "critical") {
    action =
      "Immediate action required: Evacuate the danger zone, do not cross water/cables, and contact emergency responders.";
  } else if (severity === "high") {
    action = "Avoid driving or walking through this zone. Divert through marked alternate routes.";
  }

  return {
    category,
    severity,
    confidence,
    credibilityRating,
    why,
    action,
    suggestedAgency,
    missing,
  };
}

export const askTrustReportAI = createServerFn({ method: "POST" })
  .validator((d: unknown) => chatSchema.parse(d))
  .handler(async ({ data }) => {
    const history = data.messages.slice(0, -1);
    const lastMessage = data.messages[data.messages.length - 1]!;

    const geminiReply = await callGeminiChat(SYSTEM_PROMPT, lastMessage.content, history);
    if (geminiReply) {
      return { ok: true as const, text: geminiReply, source: "gemini" as const };
    }

    const reply = generateOfflineChatReply(lastMessage.content);
    return { ok: true as const, text: reply, source: "rule_based_fallback" as const };
  });

// Backward compatibility
export const askFloodGuardAI = askTrustReportAI;

const analyzeSchema = z.object({
  category: z.string().optional(),
  description: z.string().min(3).max(2000),
  hasPhoto: z.boolean(),
  hasDepth: z.boolean(),
  hasLocation: z.boolean(),
});

const ANALYZE_PROMPT = `You are TrustReport AI's incident analyzer for a community verification prototype in Ilorin, Nigeria.
Evaluate the citizen's incident description across multiple incident categories (flooding, infrastructure, sanitation, utility, safety).
Return structured JSON with category, severity (low, moderate, high, critical), confidence (low, medium, high), credibilityRating (30-95), why, action, suggestedAgency, and missing details.
Ensure tone is professional and objective.`;

export const analyzeCommunityReport = createServerFn({ method: "POST" })
  .validator((d: unknown) => analyzeSchema.parse(d))
  .handler(async ({ data }) => {
    const userPrompt = `Category hint: ${data.category || "unspecified"}\nDescription: ${data.description}\nPhoto attached: ${data.hasPhoto}\nWater depth/Scale given: ${data.hasDepth}\nLocation specified: ${data.hasLocation}`;
    const geminiAnalysis = await callGeminiAnalysis(ANALYZE_PROMPT, userPrompt);

    if (geminiAnalysis) {
      return {
        ok: true as const,
        analysis: { ...geminiAnalysis, source: "gemini" as const },
        source: "gemini" as const,
      };
    }

    const fallback = generateOfflineAnalysis(
      data.description,
      data.hasPhoto,
      data.hasDepth,
      data.hasLocation,
    );
    return {
      ok: true as const,
      analysis: { ...fallback, source: "rule_based_fallback" as const },
      source: "rule_based_fallback" as const,
    };
  });

// Backward compatibility
export const analyzeFloodReport = analyzeCommunityReport;
