import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, fmt = "MMM dd, yyyy"): string {
  return format(new Date(date), fmt);
}

export function formatMonth(date: string | Date): string {
  return format(new Date(date), "MMMM yyyy");
}

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  return Math.max(0, ((income - expenses) / income) * 100);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Food: "#f97316",
    Transport: "#3b82f6",
    Shopping: "#8b5cf6",
    Entertainment: "#ec4899",
    Healthcare: "#10b981",
    Utilities: "#f59e0b",
    Education: "#06b6d4",
    Income: "#22c55e",
    Other: "#6b7280",
  };
  return colors[category] || "#6b7280";
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Food: "🍔",
    Transport: "🚗",
    Shopping: "🛍️",
    Entertainment: "🎬",
    Healthcare: "🏥",
    Utilities: "⚡",
    Education: "📚",
    Income: "💰",
    Other: "📦",
  };
  return icons[category] || "📦";
}

export function groupByMonth(
  transactions: { date: string; amount: number; type: string }[]
) {
  const grouped: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((t) => {
    const month = format(new Date(t.date), "MMM yyyy");
    if (!grouped[month]) {
      grouped[month] = { income: 0, expenses: 0 };
    }
    if (t.type === "income") {
      grouped[month].income += t.amount;
    } else {
      grouped[month].expenses += t.amount;
    }
  });

  return Object.entries(grouped).map(([month, data]) => ({
    month,
    ...data,
  }));
}

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val === null || val === undefined ? "" : String(val);
          return str.includes(",") ? `"${str}"` : str;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Utilities",
  "Education",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Other Income",
] as const;
