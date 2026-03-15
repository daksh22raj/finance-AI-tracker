"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, CATEGORIES, getCategoryIcon } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Budget {
  _id: string;
  category: string;
  limit: number;
  month: number;
  year: number;
}

export default function BudgetsPage() {
  const now = new Date();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [spending, setSpending] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [budgetsRes, txRes] = await Promise.all([
        fetch(`/api/budgets?month=${month}&year=${year}`),
        fetch(`/api/transactions?month=${month}&year=${year}&type=expense&limit=500`),
      ]);
      const { budgets } = await budgetsRes.json();
      const { transactions } = await txRes.json();
      setBudgets(budgets || []);
      const sp: Record<string, number> = {};
      (transactions || []).forEach((t: { category: string; amount: number }) => {
        sp[t.category] = (sp[t.category] || 0) + t.amount;
      });
      setSpending(sp);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    if (!category || !limit) return;
    setSaving(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, limit: parseFloat(limit), month, year }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Budget set!", description: `Budget for ${category} saved.`, variant: "success" as const });
      setShowForm(false);
      setCategory("");
      setLimit("");
      fetchData();
    } catch {
      toast({ title: "Error", description: "Failed to save budget.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/budgets?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">Budget period: <strong className="text-foreground">{monthName}</strong></p>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Set Budget
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-medium text-foreground">No budgets set</p>
            <p className="text-sm text-muted-foreground mt-1">Set spending limits by category to stay on track</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Create First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {budgets.map((budget) => {
            const spent = spending[budget.category] || 0;
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const remaining = budget.limit - spent;
            const isOver = spent > budget.limit;
            const isWarning = percentage >= 80 && !isOver;

            return (
              <Card
                key={budget._id}
                className={cn(
                  "relative transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
                  isOver && "border-red-500/40 bg-red-950/10",
                  isWarning && "border-amber-500/40"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(budget.category)}</span>
                      <CardTitle className="text-base">{budget.category}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      {isOver && (
                        <Badge variant="expense" className="text-[10px]">
                          <AlertTriangle className="w-2.5 h-2.5 mr-1" /> Over!
                        </Badge>
                      )}
                      {isWarning && (
                        <Badge variant="warning" className="text-[10px]">
                          Warning
                        </Badge>
                      )}
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(budget._id)}>
                        <Trash2 className="w-3 h-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className={cn("font-semibold", isOver ? "text-red-500" : "text-foreground")}>
                      {formatCurrency(spent)}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2"
                    indicatorClassName={cn(
                      isOver ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(0)}% used</span>
                    <span>
                      {remaining >= 0
                        ? `${formatCurrency(remaining)} left`
                        : `${formatCurrency(Math.abs(remaining))} over`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Budget: <strong className="text-foreground">{formatCurrency(budget.limit)}</strong>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Budget Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Monthly Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{getCategoryIcon(c)} {c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="budget-limit">Spending Limit ($)</Label>
              <Input
                id="budget-limit"
                type="number"
                step="0.01"
                min="1"
                placeholder="e.g. 500"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving || !category || !limit}>
              {saving ? "Saving..." : "Set Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
