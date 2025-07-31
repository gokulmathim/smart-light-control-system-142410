"use client";
import React, { useState } from "react";
import { useAuth } from "../../lib/authContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      const e = error as Error;
      setErr(e.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-white">
      <div className="w-full max-w-sm shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-primary font-bold text-2xl mb-6">Sign In</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Username"
            className="border rounded px-3 py-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white rounded px-4 py-2 font-semibold hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {err && <div className="mt-4 text-sm text-red-600">{err}</div>}
        <div className="mt-8 text-sm">
          No account? <Link href="/register" className="text-primary underline">Sign up</Link>
        </div>
      </div>
    </main>
  );
}
