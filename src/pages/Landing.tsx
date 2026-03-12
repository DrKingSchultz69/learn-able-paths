import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Brain, Eye, Sparkles, ArrowRight } from "lucide-react";

export default function Landing() {
  const { user } = useAuth();

  const features = [
    { icon: Brain, title: "3-Part Screening", desc: "Reading speed, rhyme recognition, and handwriting analysis" },
    { icon: Eye, title: "Adaptive Reading", desc: "Customizable fonts, spacing, and colors for comfortable reading" },
    { icon: Sparkles, title: "Personalized Results", desc: "Risk assessment with actionable recommendations" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="container py-20 md:py-32 flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm animate-fade-in">
          <BookOpen className="h-4 w-4 text-primary" />
          <span>Free dyslexia screening tool</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Understand your reading.{" "}
          <span className="text-gradient">Unlock your potential.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
          LearnAble provides accessible dyslexia screening with personalized results and adaptive reading tools — all in your browser, completely free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button size="lg" asChild className="text-lg px-8">
            <Link to={user ? "/assessment" : "/signup"}>
              Start Free Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {!user && (
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/login">I have an account</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="rounded-xl border bg-card p-8 flex flex-col gap-4 animate-fade-in hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card border-y py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Account", desc: "Sign up in seconds with your email" },
              { step: "2", title: "Take Assessment", desc: "Complete 3 short, engaging activities" },
              { step: "3", title: "Get Results", desc: "Receive your risk score and recommendations" },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
