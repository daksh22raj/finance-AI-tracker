"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon, downloadCSV } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ReportData {
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: string;
    transactionCount: number;
  };
  categoryBreakdown: Record<string, number>;
  month: number;
  year: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function ReportsPage() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?month=${month}&year=${year}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const handleExportCSV = () => {
    if (!data) return;
    const rows = data.transactions.map((t) => ({
      Date: formatDate(t.date),
      Type: t.type,
      Category: t.category,
      Description: t.description,
      Amount: t.amount,
    }));
    downloadCSV(rows, `finance-report-${MONTHS[parseInt(month) - 1]}-${year}.csv`);
  };

  const handleExportPDF = async () => {
    if (!data) return;
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();
    const monthName = `${MONTHS[parseInt(month) - 1]} ${year}`;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Financial Report", 14, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(monthName, 14, 30);

    // Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Summary", 14, 45);

    const summaryRows = [
      ["Total Income", formatCurrency(data.summary.totalIncome)],
      ["Total Expenses", formatCurrency(data.summary.totalExpenses)],
      ["Net Savings", formatCurrency(data.summary.netSavings)],
      ["Savings Rate", `${data.summary.savingsRate}%`],
      ["Total Transactions", String(data.summary.transactionCount)],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryRows,
      theme: "grid",
      headStyles: { fillColor: [109, 40, 217] },
      margin: { left: 14, right: 14 },
    });

    // Transactions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Transactions", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Date", "Type", "Category", "Description", "Amount"]],
      body: data.transactions.map((t) => [
        formatDate(t.date),
        t.type,
        t.category,
        t.description,
        `${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [109, 40, 217] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`financial-report-${monthName.replace(/ /g, "-")}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={loading || !data}>
            <Download className="w-4 h-4 mr-1.5" /> CSV
          </Button>
          <Button onClick={handleExportPDF} disabled={loading || !data}>
            <FileText className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Income</p>
                  <p className="text-xl font-bold text-emerald-500">{formatCurrency(data.summary.totalIncome)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Expenses</p>
                  <p className="text-xl font-bold text-red-500">{formatCurrency(data.summary.totalExpenses)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net Savings</p>
                  <p className={cn("text-xl font-bold", data.summary.netSavings >= 0 ? "text-blue-500" : "text-red-500")}>
                    {formatCurrency(data.summary.netSavings)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          {Object.keys(data.categoryBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Expense breakdown for {MONTHS[parseInt(month) - 1]} {year}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.categoryBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, amount]) => {
                      const pct = data.summary.totalExpenses > 0
                        ? (amount / data.summary.totalExpenses) * 100
                        : 0;
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="text-lg w-7">{getCategoryIcon(cat)}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{cat}</span>
                              <span className="text-muted-foreground">{formatCurrency(amount)} ({pct.toFixed(1)}%)</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: getCategoryColor(cat) }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transaction List */}
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>{data.summary.transactionCount} transactions in {MONTHS[parseInt(month) - 1]} {year}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {data.transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No transactions this month</div>
              ) : (
                <div className="divide-y divide-border">
                  {data.transactions.map((t) => (
                    <div key={t._id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getCategoryIcon(t.category)}</span>
                        <div>
                          <p className="text-sm font-medium">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{t.category} · {formatDate(t.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={t.type === "income" ? "income" : "expense"}>{t.type}</Badge>
                        <span className={`text-sm font-semibold ${t.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                          {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
