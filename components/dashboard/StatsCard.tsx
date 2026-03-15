import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: number;
  description?: string;
  variant?: "default" | "income" | "expense" | "savings";
  loading?: boolean;
}

const variantStyles = {
  default: "from-violet-500/10 to-indigo-500/10 border-violet-200/20",
  income: "from-emerald-500/10 to-teal-500/10 border-emerald-200/20",
  expense: "from-red-500/10 to-rose-500/10 border-red-200/20",
  savings: "from-blue-500/10 to-cyan-500/10 border-blue-200/20",
};

const iconStyles = {
  default: "bg-violet-500/20 text-violet-500",
  income: "bg-emerald-500/20 text-emerald-500",
  expense: "bg-red-500/20 text-red-500",
  savings: "bg-blue-500/20 text-blue-500",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  description,
  variant = "default",
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "stat-card bg-gradient-to-br border",
        variantStyles[variant]
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1 text-foreground">
              {formatCurrency(value)}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium",
                change >= 0 ? "text-emerald-500" : "text-red-500"
              )}>
                <span>{change >= 0 ? "↑" : "↓"}</span>
                <span>{Math.abs(change).toFixed(1)}% vs last month</span>
              </div>
            )}
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3", iconStyles[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
