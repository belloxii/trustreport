import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Info,
  Shield,
  Search,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { SeverityPill } from "@/components/SeverityPill";
import { CategoryPill } from "@/components/CategoryPill";
import { askFloodGuardAI, analyzeFloodReport } from "@/lib/ai.functions";
import { type Severity, type IncidentCategory } from "@/lib/floodguard-data";
import { toast } from "sonner";

export const Route = createFileRoute("/ai")({
  component: AiPage,
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "Around Tanke bridge, runoff is overflowing knee-deep and two cars are stalled.",
  "An electric pole fell across the road near GRA after heavy wind and rain.",
  "Market vendors dumped trash in the Adewole culvert, completely blocking drainage.",
  "How can community members verify an incident without putting themselves in danger?",
  "What makes an incident report credible and actionable for civil responders?",
];

function AiPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "analyzer">("chat");

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hello! I am TrustReport AI, your community incident verification and safety assistant. Ask me anything about verifying incident claims, staying safe during flash floods or electrical hazards, assessing civic risks in Ilorin, or structuring a high-credibility incident report!",
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Analyzer State
  const [analyzerCategory, setAnalyzerCategory] = useState<string>("flooding");
  const [analyzerText, setAnalyzerText] = useState(
    "Around Tanke bridge near University road, flood runoff has risen to waist level and two tricycles are stuck in the center. An electric cable from the pole is sagging dangerously close to the standing water.",
  );
  const [analyzerLoading, setAnalyzerLoading] = useState(false);
  const [analyzerSource, setAnalyzerSource] = useState<"gemini" | "rule_based_fallback" | null>(
    null,
  );
  const [analyzerResult, setAnalyzerResult] = useState<{
    category?: string;
    severity: string;
    credibilityScore?: number;
    confidence: string;
    why: string;
    action: string;
    missing: string[];
    suggestedVerificationSteps?: string[];
    assignedResponder?: string;
  } | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handleSendChat = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setChatLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      history.push({ role: "user", content: text });

      const res = await askFloodGuardAI({
        data: {
          messages: history,
        },
      });

      if (res.ok && res.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: res.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        toast.error("Could not complete AI response. Please try again.");
      }
    } catch {
      toast.error("Network error communicating with TrustReport AI.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunAnalyzer = async () => {
    if (!analyzerText.trim() || analyzerText.length < 5) {
      toast.error("Please enter an incident description to analyze.");
      return;
    }

    setAnalyzerLoading(true);
    try {
      const res = await analyzeFloodReport({
        data: {
          category: analyzerCategory,
          description: analyzerText,
          hasPhoto: true,
          hasDepth: true,
          hasLocation: true,
        },
      });

      if (res.ok && res.analysis) {
        setAnalyzerResult(res.analysis);
        setAnalyzerSource(res.source || "rule_based_fallback");
        const sourceName =
          res.source === "gemini" ? "Gemini 2.5 Flash" : "offline rule-based engine";
        toast.success(`Analysis generated using ${sourceName}! 🤖`);
      } else {
        toast.error("Analysis could not be generated.");
      }
    } catch {
      toast.error("Network error analyzing report.");
    } finally {
      setAnalyzerLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-2xl">
              🤖
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold text-foreground">
                TrustReport AI
              </h1>
              <p className="text-xs font-bold text-primary">
                Civic Verification & Safety Intelligence
              </p>
            </div>
            <DemoBadge />
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center rounded-2xl border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-colors ${
              activeTab === "chat"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            💬 Safety & Verification Chat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("analyzer")}
            className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-colors ${
              activeTab === "analyzer"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🔎 Credibility & Risk Evaluator
          </button>
        </div>
      </div>

      {/* Safety & Ethics Disclaimer Banner */}
      <div className="flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-semibold text-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary" />
        <span>
          <strong>Ethical AI Disclosure:</strong> TrustReport AI provides automated analysis to
          assist community verification and prioritize field responses. It is an advisory aid, not
          definitive proof. In life-threatening emergencies, always dial official Kwara emergency
          services.
        </span>
      </div>

      {activeTab === "chat" ? (
        /* Chat Interface */
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Chat Window (8 cols) */}
          <div className="flex flex-col h-[600px] rounded-3xl border border-border bg-card shadow-sm lg:col-span-8 overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isAi = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAi ? "justify-start" : "justify-end"}`}
                  >
                    {isAi && (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-lg">
                        🤖
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-3xl p-4 text-sm font-medium shadow-sm leading-relaxed ${
                        isAi
                          ? "bg-muted/70 text-foreground rounded-tl-sm border border-border/50"
                          : "bg-primary text-primary-foreground rounded-tr-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <span
                        className={`block mt-1 text-[10px] ${
                          isAi ? "text-muted-foreground" : "text-primary-foreground/75"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-lg">
                    🤖
                  </div>
                  <div className="rounded-2xl bg-muted/60 px-4 py-3 text-xs font-bold text-muted-foreground animate-pulse">
                    TrustReport AI is analyzing safety facts...
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-border bg-background/50 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a question about incident verification, flood safety, or reporting..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={chatLoading}
                  className="flex-1 rounded-2xl border border-input bg-background px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || chatLoading}
                  className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Send className="size-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Suggested Prompts & Tips (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-3">
              <h3 className="font-display text-sm font-extrabold flex items-center gap-2">
                <Sparkles className="size-4 text-purple-500" /> Suggested Scenarios
              </h3>
              <p className="text-xs font-medium text-muted-foreground">
                Click any scenario below to test TrustReport AI's verification and safety
                intelligence:
              </p>

              <div className="flex flex-col gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendChat(prompt)}
                    className="rounded-2xl border border-border bg-background p-3 text-left text-xs font-bold text-foreground transition-all hover:bg-accent hover:border-primary/40"
                  >
                    “{prompt}”
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/40 p-5 text-xs font-semibold text-muted-foreground space-y-2">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle className="size-4 text-primary" /> What can I ask?
              </div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Whether an Ilorin road or underpass is safe after rain</li>
                <li>How to safely photograph an electrical or flood hazard</li>
                <li>Which civil agency handles broken culverts vs down wires</li>
                <li>How to evaluate conflicting reports from social media</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Analyzer Tool */
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-6 space-y-4">
            <div>
              <h2 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
                <Search className="size-5 text-primary" /> Evaluate Incident Credibility & Risk
              </h2>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                Paste any incident draft or eyewitness observation. TrustReport AI will estimate
                credibility, categorize hazards, suggest responder routing, and point out missing
                verification clues.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                Incident Category
              </label>
              <select
                value={analyzerCategory}
                onChange={(e) => setAnalyzerCategory(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background p-3 text-xs font-bold"
              >
                <option value="flooding">🌊 Flooding & Water Overflow</option>
                <option value="infrastructure">🏗️ Damaged Infrastructure / Bridge</option>
                <option value="sanitation">🗑️ Blocked Drainage / Waste Choke</option>
                <option value="utility">⚡ Utility / Power Line Outage</option>
                <option value="safety">🛡️ Public Safety / Obstruction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                Observation Text
              </label>
              <textarea
                rows={7}
                value={analyzerText}
                onChange={(e) => setAnalyzerText(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background p-4 text-sm font-medium focus:ring-2 focus:ring-primary"
                placeholder="Type or paste an incident observation..."
              />
            </div>

            <button
              type="button"
              onClick={handleRunAnalyzer}
              disabled={analyzerLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {analyzerLoading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" /> Evaluating Credibility...
                </>
              ) : (
                <>
                  <Bot className="size-4" /> 🤖 Evaluate Credibility & Safety Action
                </>
              )}
            </button>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-purple-500" /> Credibility Assessment
              </h2>
              {analyzerSource && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
                    analyzerSource === "gemini"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  {analyzerSource === "gemini"
                    ? "✨ Gemini 2.5 Flash"
                    : "⚙️ Offline Rule-Based Fallback"}
                </span>
              )}
            </div>

            {analyzerResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted/60 p-4">
                    <span className="text-xs font-bold text-muted-foreground block">
                      Estimated Severity
                    </span>
                    <div className="mt-1">
                      <SeverityPill severity={analyzerResult.severity.toLowerCase() as Severity} />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-muted/60 p-4">
                    <span className="text-xs font-bold text-muted-foreground block">
                      Credibility Score
                    </span>
                    <div className="mt-1 font-display text-xl font-extrabold text-primary">
                      {analyzerResult.credibilityScore ?? 85}%
                    </div>
                  </div>
                </div>

                {analyzerResult.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">Classified As:</span>
                    <CategoryPill category={analyzerResult.category as IncidentCategory} />
                  </div>
                )}

                <div className="rounded-2xl border border-border p-4 space-y-1.5">
                  <span className="text-xs font-extrabold text-foreground block">
                    Assessment Rationale:
                  </span>
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    {analyzerResult.why}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1.5">
                  <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200 block">
                    Recommended Community Actions:
                  </span>
                  <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-100">
                    {analyzerResult.action}
                  </p>
                </div>

                {analyzerResult.assignedResponder && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs font-semibold">
                    <span className="text-muted-foreground">Recommended Civil Responder: </span>
                    <strong className="text-primary">{analyzerResult.assignedResponder}</strong>
                  </div>
                )}

                {analyzerResult.missing && analyzerResult.missing.length > 0 && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                    <span className="text-xs font-extrabold text-amber-800 dark:text-amber-200 block">
                      Clues That Would Increase Verification Confidence:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analyzerResult.missing.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-xl bg-card px-2.5 py-1 text-xs font-bold text-foreground shadow-sm"
                        >
                          <CheckCircle2 className="size-3 text-amber-500" /> {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border p-6 text-center text-muted-foreground space-y-2">
                <Bot className="size-8 text-muted-foreground/60" />
                <p className="text-sm font-bold text-foreground">No Assessment Generated Yet</p>
                <p className="text-xs max-w-xs">
                  Click “Evaluate Credibility & Safety Action” on the left to analyze the incident
                  claim.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
