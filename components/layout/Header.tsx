"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": { title: "Dashboard", description: "Your financial overview" },
  "/transactions": { title: "Transactions", description: "Income & expense history" },
  "/receipts": { title: "Receipt Scanner", description: "Extract data from receipts using AI" },
  "/budgets": { title: "Budgets", description: "Set and track spending limits" },
  "/reports": { title: "Reports", description: "Monthly financial reports" },
  "/ai-advice": { title: "AI Advisor", description: "Personalized financial insights" },
};

export default function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: "Dashboard", description: "" };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-foreground leading-none">{page.title}</h1>
        {page.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{page.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell (placeholder) */}
        <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-medium flex items-center justify-center">
            1
          </span>
        </button>
      </div>
    </header>
  );
}
