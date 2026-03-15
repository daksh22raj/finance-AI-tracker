"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";
import { format } from "date-fns";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTransaction?: {
    _id: string;
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    date: string;
  } | null;
}

interface FormValues {
  type: "income" | "expense";
  amount: string;
  category: string;
  description: string;
  date: string;
}

export default function TransactionModal({
  open,
  onClose,
  onSuccess,
  editTransaction,
}: TransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [txType, setTxType] = useState<"income" | "expense">(
    editTransaction?.type || "expense"
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: editTransaction?.type || "expense",
      amount: editTransaction?.amount?.toString() || "",
      category: editTransaction?.category || "",
      description: editTransaction?.description || "",
      date: editTransaction?.date
        ? format(new Date(editTransaction.date), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    },
  });

  const categories = txType === "income" ? [...INCOME_CATEGORIES] : [...CATEGORIES];

  const isEditing = !!(editTransaction && editTransaction._id);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const payload = { ...data, type: txType };
      const url = isEditing
        ? `/api/transactions/${editTransaction._id}`
        : "/api/transactions";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save transaction");
      }

      toast({
        title: isEditing ? "Transaction updated!" : "Transaction added!",
        description: `${txType === "income" ? "Income" : "Expense"} of $${data.amount} recorded.`,
        variant: "success" as const,
      });

      reset();
      onClose();
      onSuccess();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to save transaction.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type Toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => { setTxType("expense"); setValue("category", ""); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${txType === "expense" ? "bg-red-500 text-white" : "bg-transparent text-muted-foreground hover:bg-accent"}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => { setTxType("income"); setValue("category", ""); }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${txType === "income" ? "bg-emerald-500 text-white" : "bg-transparent text-muted-foreground hover:bg-accent"}`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Must be > 0" } })}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select onValueChange={(v) => setValue("category", v)} defaultValue={editTransaction?.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: "Date is required" })}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
