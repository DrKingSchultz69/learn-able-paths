import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl" aria-label="LearnAble Home">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-gradient">LearnAble</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Main navigation">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard"><LayoutDashboard className="h-4 w-4 mr-1" />Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/assessment">Assessment</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/reading">Reading Tools</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile"><User className="h-4 w-4 mr-1" />Profile</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t bg-card p-4 flex flex-col gap-2 animate-fade-in" aria-label="Mobile navigation">
            {user ? (
              <>
                <Link to="/dashboard" className="p-2 rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/assessment" className="p-2 rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Assessment</Link>
                <Link to="/reading" className="p-2 rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Reading Tools</Link>
                <Link to="/profile" className="p-2 rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button className="p-2 rounded-md hover:bg-muted text-left text-destructive" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="p-2 rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="p-2 rounded-md hover:bg-muted" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} LearnAble — Accessible Dyslexia Screening & Support</p>
      </footer>
    </div>
  );
}
