"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/authContext";
import { FiPower, FiSun, FiBriefcase, FiList, FiClock, FiLogOut } from "react-icons/fi";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: SidebarLink[] = [
  { label: "Devices", href: "/dashboard/devices", icon: <FiBriefcase /> },
  { label: "Live Controls", href: "/dashboard/controls", icon: <FiSun /> },
  { label: "Schedules", href: "/dashboard/routines", icon: <FiClock /> },
  { label: "Usage Logs", href: "/dashboard/logs", icon: <FiList /> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col py-8 px-4 h-screen bg-white border-r border-gray-200 min-w-[var(--sidebar-width)]">
      <div className="font-bold text-lg text-primary mb-8 pl-2 tracking-wide select-none">
        <FiPower className="inline-block mr-1" /> Smart Light
      </div>
      <nav className="flex-1 flex flex-col gap-3">
        {navLinks.map(({ label, href, icon }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-2 rounded px-2 py-2 transition text-base ${
              pathname === href
                ? "bg-primary/10 font-semibold text-primary"
                : "hover:bg-gray-50"
            }`}
          >
            {icon} {label}
          </Link>
        ))}
      </nav>
      {user && (
        <div className="mt-12 pl-2 text-xs text-gray-500">
          <span className="block mb-2">Logged in as <span className="text-primary font-semibold">{user}</span></span>
          <button onClick={logout} className="flex items-center text-red-500 hover:underline hover:text-red-600 text-sm"><FiLogOut className="mr-1" /> Logout</button>
        </div>
      )}
    </aside>
  );
}
