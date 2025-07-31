"use client";
import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <main className="flex-1 min-w-0 px-2 sm:px-6 py-8">{children}</main>
    </div>
  );
}
