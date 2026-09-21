import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { BADGES, LEADERBOARD, QUIZ, type QuizQuestion } from "@/lib/floodguard-data";
import { useProgress } from "@/lib/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/heroes")({
  component: HeroesPage,
});

function HeroesPage() {
  const { points, badges, addPoints, hasBadge } = useProgress();

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = QUIZ[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);

    if (index === currentQ.answer) {
      setScore((s) => s + 1);
      addPoints(10, `quiz-q-${currentQIndex}`);
      toast.success("Correct! +10 Flood Hero points 🌟");
    } else {
      toast.error("Not quite! Read the explanation below.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < QUIZ.length - 1) {
      setCurrentQIndex((idx) => idx + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setQuizCompleted(true);
      if (score >= 4) {
        toast.success("🎉 Quiz Completed! You unlocked the Safety Hero Badge!");
      } else {
        toast.info("Quiz Completed! Review safety rules and try again anytime.");
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Flood Heroes & Safety Quiz
          </h1>
          <DemoBadge />
        </div>
        <p className="mt-2 text-sm font-semibold text-muted-foreground max-w-2xl">
          Learn, earn points, climb the community leaderboard, and unlock safety badges by
          protecting your neighborhood.
        </p>
      </div>

      {/* Your Hero Profile Summary Card */}
      <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-primary/20 text-3xl shadow-inner">
              👑
            </div>
            <div>
              <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[11px] font-extrabold text-primary">
                Student Safety Hero
              </span>
              <h2 className="font-display text-2xl font-extrabold text-foreground mt-0.5">
                Your Safety Journey
              </h2>
              <p className="text-xs font-semibold text-muted-foreground">
                Earn badges by taking the quiz, verifying community alerts, and reporting hazards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-2xl bg-card border border-border p-4 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
                Total Score
              </span>
              <span className="font-display text-3xl font-extrabold text-primary">
                {points} <span className="text-sm font-bold text-foreground">pts</span>
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="text-[10px] font-extrabold uppercase text-muted-foreground block">
                Badges Unlocked
              </span>
              <span className="font-display text-3xl font-extrabold text-amber-500">
                {badges.length} / {BADGES.length}
              </span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="mt-8">
          <h3 className="font-display text-sm font-extrabold text-foreground mb-3 flex items-center gap-2">
            <Award className="size-4 text-primary" /> Safety Badges
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {BADGES.map((badge) => {
              const isUnlocked = hasBadge(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl border p-3.5 text-center transition-all ${
                    isUnlocked
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-950 dark:text-amber-100 shadow-sm"
                      : "border-border bg-card/60 opacity-60 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-1">{badge.emoji}</div>
                  <h4 className="font-display text-xs font-extrabold">{badge.name}</h4>
                  <p className="mt-1 text-[10px] font-medium text-muted-foreground leading-tight">
                    {badge.how}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                      isUnlocked
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isUnlocked ? "UNLOCKED ✓" : "LOCKED"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Safety Quiz */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
              🧠 Test Your Knowledge
            </span>
            <h2 className="font-display text-2xl font-extrabold text-foreground">
              Ilorin Flood Safety Quiz
            </h2>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
            {quizCompleted ? "Completed" : `Question ${currentQIndex + 1} of ${QUIZ.length}`}
          </span>
        </div>

        {!quizCompleted ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                Level: {currentQ.level}
              </span>
            </div>

            <h3 className="font-display text-lg font-extrabold text-foreground sm:text-xl">
              {currentQ.q}
            </h3>

            {/* Options */}
            <div className="grid gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.answer;

                let btnStyle = "border-border bg-background hover:bg-muted/40 text-foreground";
                if (answered) {
                  if (isCorrect) {
                    btnStyle =
                      "border-emerald-500 bg-emerald-500/20 text-emerald-950 dark:text-emerald-100 font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-destructive bg-destructive/15 text-destructive font-bold";
                  } else {
                    btnStyle = "border-border opacity-50 bg-background";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={answered}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition-all ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {answered && isCorrect && (
                      <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {answered && isSelected && !isCorrect && (
                      <XCircle className="size-5 text-destructive" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {answered && (
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 space-y-2">
                <span className="text-xs font-extrabold text-primary block">
                  💡 Why this matters:
                </span>
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  {currentQ.why}
                </p>

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground hover:bg-primary/90"
                  >
                    {currentQIndex < QUIZ.length - 1 ? "Next Question" : "Finish Quiz"}{" "}
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results screen */
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/20 text-4xl">
              {score >= 4 ? "🌟" : "👍"}
            </div>

            <h3 className="font-display text-2xl font-extrabold text-foreground">
              You Scored {score} out of {QUIZ.length}!
            </h3>

            <p className="text-sm font-semibold text-muted-foreground max-w-md mx-auto">
              {score >= 4
                ? "Outstanding work! You've proven yourself as a true Flood Safety Hero for Ilorin."
                : "Good job! Keeping our community safe means staying alert and knowing what to do during rainstorms."}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-extrabold text-primary-foreground shadow hover:bg-primary/90"
              >
                <RotateCcw className="size-4" /> Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Community Leaderboard Table */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
              <Users className="size-5 text-primary" /> Community Leaderboard
            </h2>
            <p className="text-xs font-semibold text-muted-foreground">
              Top student and neighborhood safety champions in Ilorin.
            </p>
          </div>
          <DemoBadge />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 pt-2">Rank</th>
                <th className="pb-3 pt-2">Champion</th>
                <th className="pb-3 pt-2">Neighborhood</th>
                <th className="pb-3 pt-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEADERBOARD.map((item, idx) => (
                <tr key={item.name} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 font-display font-extrabold text-foreground">
                    {item.emoji} #{idx + 1}
                  </td>
                  <td className="py-3 font-bold text-foreground">{item.name}</td>
                  <td className="py-3 text-muted-foreground">{item.area}, Ilorin</td>
                  <td className="py-3 text-right font-display font-extrabold text-primary">
                    {item.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
