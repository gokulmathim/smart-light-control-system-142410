"use client";
import React, { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

// PUBLIC_INTERFACE
export interface AuthContextProps {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Try to load from localStorage at startup
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setToken(t);
      setUser(u);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    setUser(username);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", username);
    router.push("/dashboard/devices");
  };

  const register = async (username: string, password: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/auth/register`,
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) throw new Error("Registration failed");
    await login(username, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
