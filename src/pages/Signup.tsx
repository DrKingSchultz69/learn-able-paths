import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, User } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", name: "", age: "", role: "" as User["role"] | "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password || !form.name || !form.age || !form.role) {
      setError("All fields are required");
      return;
    }
    const result = signup({
      email: form.email,
      password: form.password,
      name: form.name,
      age: parseInt(form.age),
      role: form.role as User["role"],
    });
    if (result.success) navigate("/dashboard");
    else setError(result.error || "Signup failed");
  };

  return (
    <div className="container max-w-md py-16 animate-fade-in">
      <div className="flex flex-col items-center gap-4 mb-8">
        <BookOpen className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-center">Join LearnAble to start your dyslexia screening</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" min={4} max={99} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Your age" />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
            <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-destructive text-sm" role="alert">{error}</p>}
        <Button type="submit" className="w-full" size="lg">Create Account</Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
