"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ScanLine,
  Target,
  FileBarChart2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/receipts", label: "Receipt Scanner", icon: ScanLine },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
  { href: "/ai-advice", label: "AI Advisor", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside
      className={cn(
        "sidebar-gradient flex flex-col h-screen border-r border-white/5 transition-all duration-300 ease-in-out relative z-50",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg shadow-lg flex-shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <span className="text-white font-bold text-sm leading-none">
                AI Finance
              </span>
              <br />
              <span className="text-violet-300 text-xs">Tracker</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-violet-600 border border-violet-400/30 flex items-center justify-center text-white hover:bg-violet-500 transition-colors shadow-lg z-50"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-violet-600/30 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  active ? "text-violet-300" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              {!collapsed && (
                <span className="truncate animate-fade-in">{label}</span>
              )}
              {active && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-3">
        {/* Dark mode toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200",
            collapsed && "justify-center"
          )}
          aria-label="Toggle dark mode"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="w-5 h-5 flex-shrink-0 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0 text-slate-500" />
            )
          ) : (
            <div className="w-5 h-5 flex-shrink-0" />
          )}
          {!collapsed && (
            <span className="animate-fade-in">
              {mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : "Theme"}
            </span>
          )}
        </button>

        {/* User */}
        <div className={cn("flex items-center gap-3 px-1", collapsed && "justify-center")}>
          <UserButton afterSignOutUrl="/" />
          {!collapsed && (
            <span className="text-xs text-slate-500 truncate animate-fade-in">
              My Account
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
