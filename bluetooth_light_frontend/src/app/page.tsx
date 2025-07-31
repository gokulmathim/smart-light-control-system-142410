"use client";
import { useEffect } from "react";
import { useAuth } from "../lib/authContext";
import { useRouter } from "next/navigation";

/**
 * Redirects user after mount depending on auth state.
 */
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace("/dashboard/devices");
    else router.replace("/login");
  }, [user, router]);
  return null;
}
