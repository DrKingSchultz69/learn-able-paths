import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAssessments } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, BookOpen, TrendingUp, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const assessments = getUserAssessments(user.id);
  const latest = assessments[assessments.length - 1];

  const riskColor = (level?: string) =>
    level === "High" ? "text-danger" : level === "Moderate" ? "text-warning" : "text-success";

  return (
    <div className="container py-10 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="text-muted-foreground mb-8">Here's your learning overview</p>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
          <ClipboardCheck className="h-8 w-8 text-primary" />
          <h3 className="font-semibold text-lg">Assessments</h3>
          <p className="text-3xl font-bold">{assessments.length}</p>
          <p className="text-sm text-muted-foreground">completed</p>
        </div>
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h3 className="font-semibold text-lg">Latest Score</h3>
          {latest ? (
            <>
              <p className={`text-3xl font-bold ${riskColor(latest.riskLevel)}`}>{latest.riskScore}/100</p>
              <p className={`text-sm font-medium ${riskColor(latest.riskLevel)}`}>{latest.riskLevel} Risk</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No assessments yet</p>
          )}
        </div>
        <div className="rounded-xl border bg-card p-6 flex flex-col gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h3 className="font-semibold text-lg">Reading Tools</h3>
          <p className="text-sm text-muted-foreground">Customize fonts, colors, and spacing for comfortable reading</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link to="/assessment">Take Assessment <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/reading">Reading Tools</Link>
        </Button>
      </div>

      {assessments.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Assessment History</h2>
          <div className="space-y-3">
            {assessments.slice().reverse().map((a) => (
              <Link
                key={a.id}
                to={`/results/${a.id}`}
                className="flex items-center justify-between rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium">{new Date(a.date).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Score: {a.riskScore}/100</p>
                </div>
                <span className={`font-semibold ${riskColor(a.riskLevel)}`}>{a.riskLevel}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
