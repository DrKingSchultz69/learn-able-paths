import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  role: "Student" | "Parent" | "Teacher";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: { email: string; password: string; name: string; age: number; role: User["role"] }) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("learnable_session");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  const getUsers = (): Record<string, { user: User; password: string }> => {
    try {
      return JSON.parse(localStorage.getItem("learnable_users") || "{}");
    } catch {
      return {};
    }
  };

  const signup = (data: { email: string; password: string; name: string; age: number; role: User["role"] }) => {
    const users = getUsers();
    if (users[data.email]) return { success: false, error: "Email already registered" };
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      age: data.age,
      role: data.role,
      createdAt: new Date().toISOString(),
    };
    users[data.email] = { user: newUser, password: data.password };
    localStorage.setItem("learnable_users", JSON.stringify(users));
    localStorage.setItem("learnable_session", JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const users = getUsers();
    const entry = users[email];
    if (!entry) return { success: false, error: "Account not found" };
    if (entry.password !== password) return { success: false, error: "Incorrect password" };
    localStorage.setItem("learnable_session", JSON.stringify(entry.user));
    setUser(entry.user);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("learnable_session");
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("learnable_session", JSON.stringify(updated));
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].user = updated;
      localStorage.setItem("learnable_users", JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
