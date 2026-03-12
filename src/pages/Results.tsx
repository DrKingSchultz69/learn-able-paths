import { useParams, Link } from "react-router-dom";
import { getAssessments, getAgeNorm } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";

function CircularGauge({ score, level }: { score: number; level: string }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = level === "High" ? "hsl(var(--danger))" : level === "Moderate" ? "hsl(var(--warning))" : "hsl(var(--success))";

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="200" height="200" viewBox="0 0 200 200" aria-label={`Risk score: ${score} out of 100, ${level} risk`}>
        <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="12" />
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <text x="100" y="90" textAnchor="middle" className="fill-foreground text-4xl font-bold" fontSize="40">{score}</text>
        <text x="100" y="115" textAnchor="middle" className="fill-muted-foreground text-sm" fontSize="14">/ 100</text>
      </svg>
      <span
        className="inline-block px-4 py-1.5 rounded-full font-semibold text-sm"
        style={{
          backgroundColor: level === "High" ? "hsl(var(--danger) / 0.15)" : level === "Moderate" ? "hsl(var(--warning) / 0.15)" : "hsl(var(--success) / 0.15)",
          color,
        }}
      >
        {level} Risk
      </span>
    </div>
  );
}

function getRecommendations(score: number, level: string, wpmRatio: number, rhymeAccuracy: number, reversalCount: number): string[] {
  const recs: string[] = [];
  if (level === "High") {
    recs.push("We strongly recommend a professional evaluation by a learning specialist or educational psychologist.");
    recs.push("Request accommodations at school such as extra time on tests and access to audiobooks.");
  }
  if (level === "Moderate" || level === "High") {
    recs.push("Try our adaptive reading tools with dyslexia-friendly fonts and customizable spacing.");
  }
  if (wpmRatio < 0.8) {
    recs.push("Practice daily reading with short, engaging passages to gradually improve reading speed.");
  }
  if (rhymeAccuracy < 70) {
    recs.push("Play word games and rhyming activities to strengthen phonological awareness.");
  }
  if (reversalCount > 3) {
    recs.push("Practice letter formation with multi-sensory techniques like tracing letters in sand or clay.");
  }
  if (level === "Low") {
    recs.push("Your results look good! Continue reading regularly and explore our reading tools for extra comfort.");
  }
  return recs.slice(0, 5);
}

export default function Results() {
  const { id } = useParams();
  const { user } = useAuth();
  const assessments = getAssessments();
  const assessment = assessments.find((a) => a.id === id);

  if (!assessment || !user) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Assessment not found.</p>
        <Button asChild className="mt-4"><Link to="/dashboard">Go to Dashboard</Link></Button>
      </div>
    );
  }

  const ageNorm = getAgeNorm(user.age);
  const recs = getRecommendations(assessment.riskScore, assessment.riskLevel, assessment.wpmRatio, assessment.rhymeAccuracy, assessment.reversalCount);

  const breakdowns = [
    {
      label: "Reading Speed",
      value: `${assessment.readingSpeed} WPM`,
      detail: `Age norm: ${ageNorm} WPM (${Math.round(assessment.wpmRatio * 100)}%)`,
      contribution: assessment.wpmRatio < 0.6 ? 40 : assessment.wpmRatio < 0.8 ? 25 : assessment.wpmRatio < 1.0 ? 10 : 0,
    },
    {
      label: "Rhyme Accuracy",
      value: `${Math.round(assessment.rhymeAccuracy)}%`,
      detail: `Avg reaction: ${assessment.reactionTime}ms`,
      contribution: assessment.rhymeAccuracy < 50 ? 35 : assessment.rhymeAccuracy < 70 ? 20 : assessment.rhymeAccuracy < 85 ? 10 : 0,
    },
    {
      label: "Letter Reversals",
      value: `${assessment.reversalCount} detected`,
      detail: "From handwriting analysis",
      contribution: Math.min(assessment.reversalCount * 5, 25),
    },
  ];

  return (
    <div className="container max-w-2xl py-10 animate-fade-in">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2">Your Results</h1>
      <p className="text-muted-foreground mb-8">{new Date(assessment.date).toLocaleDateString("en-US", { dateStyle: "long" })}</p>

      <div className="flex justify-center mb-10">
        <CircularGauge score={assessment.riskScore} level={assessment.riskLevel} />
      </div>

      {/* Breakdown */}
      <h2 className="text-xl font-semibold mb-4">Score Breakdown</h2>
      <div className="space-y-4 mb-10">
        {breakdowns.map((b) => (
          <div key={b.label} className="rounded-xl border bg-card p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{b.label}</p>
                <p className="text-sm text-muted-foreground">{b.detail}</p>
              </div>
              <span className="text-lg font-bold">{b.value}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(b.contribution / 40) * 100}%`,
                    backgroundColor: b.contribution > 25 ? "hsl(var(--danger))" : b.contribution > 10 ? "hsl(var(--warning))" : "hsl(var(--success))",
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">+{b.contribution} pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
      <div className="space-y-3 mb-10">
        {recs.map((r, i) => (
          <div key={i} className="flex gap-3 rounded-xl border bg-card p-4">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
            <p>{r}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link to="/assessment"><RotateCcw className="mr-2 h-4 w-4" />Retake Assessment</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/reading">Try Reading Tools</Link>
        </Button>
      </div>
    </div>
  );
}
