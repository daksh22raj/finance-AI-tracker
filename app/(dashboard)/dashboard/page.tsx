"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import StatsCard from "@/components/dashboard/StatsCard";
import AreaChartComponent from "@/components/dashboard/AreaChart";
import SpendingPieChart from "@/components/dashboard/SpendingPieChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, getCategoryColor, groupByMonth } from "@/lib/utils";
import TransactionModal from "@/components/transactions/TransactionModal";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transactions?limit=100");
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : "0";

  const categoryBreakdown = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const chartData = groupByMonth(
    transactions.map((t) => ({ date: t.date, amount: t.amount, type: t.type }))
  ).slice(-6);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Income" value={totalIncome} icon={TrendingUp} variant="income" loading={loading} />
        <StatsCard title="Total Expenses" value={totalExpenses} icon={TrendingDown} variant="expense" loading={loading} />
        <StatsCard title="Net Savings" value={savings} icon={PiggyBank} variant="savings" loading={loading} />
        <StatsCard
          title="Savings Rate"
          value={parseFloat(savingsRate)}
          icon={BarChart3}
          variant="default"
          description={`${savingsRate}% of income saved`}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          {loading ? (
            <Card><CardContent className="p-6"><Skeleton className="h-72 w-full" /></CardContent></Card>
          ) : (
            <AreaChartComponent data={chartData} />
          )}
        </div>
        <div>
          {loading ? (
            <Card><CardContent className="p-6"><Skeleton className="h-72 w-full" /></CardContent></Card>
          ) : (
            <SpendingPieChart data={pieData} />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest 5 transactions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/transactions">View All <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No transactions yet. Add your first one!
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <div key={t._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: getCategoryColor(t.category) + "20" }}
                    >
                      <span style={{ color: getCategoryColor(t.category) }}>
                        {t.category === "Food" ? "🍔" : t.category === "Transport" ? "🚗" : t.category === "Shopping" ? "🛍️" : t.category === "Entertainment" ? "🎬" : t.category === "Healthcare" ? "🏥" : t.category === "Utilities" ? "⚡" : t.category === "Education" ? "📚" : "💰"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.category} · {formatDate(t.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.type === "income" ? "income" : "expense"}>
                      {t.type}
                    </Badge>
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

      <TransactionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
