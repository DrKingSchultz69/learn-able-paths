import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) navigate("/dashboard");
    else setError(result.error || "Login failed");
  };

  return (
    <div className="container max-w-md py-16 animate-fade-in">
      <div className="flex flex-col items-center gap-4 mb-8">
        <BookOpen className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Log in to your LearnAble account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
        </div>
        {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
        <Button type="submit" className="w-full" size="lg">Log In</Button>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
