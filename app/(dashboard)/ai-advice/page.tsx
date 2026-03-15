"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AdviceTip {
  tip: string;
  detail: string;
  icon: string;
}

export default function AIAdvisorPage() {
  const [advice, setAdvice] = useState<AdviceTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/advice", { method: "POST" });
      const data = await res.json();
      setAdvice(data.advice || []);
      setFetched(true);
    } catch {
      setAdvice([{ tip: "Error", detail: "Could not fetch advice. Check your Gemini API key.", icon: "⚠️" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="bg-gradient-to-br from-violet-950/50 to-indigo-950/50 border-violet-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violet-300">
            <Sparkles className="w-5 h-5" /> AI Financial Advisor
          </CardTitle>
          <CardDescription>
            Powered by Google Gemini AI — get personalized financial insights based on your current month&apos;s spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={fetchAdvice}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-12 text-base"
          >
            {loading ? (
              <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Analyzing your finances...</>
            ) : fetched ? (
              <><RefreshCw className="w-5 h-5 mr-2" /> Refresh Advice</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" /> Get AI Financial Advice</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && advice.length > 0 && (
        <div className="space-y-3">
          {advice.map((item, index) => (
            <Card
              key={index}
              className={cn(
                "animate-fade-in transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                "border-border"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.tip}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-violet-500/20 bg-violet-950/10">
            <CardContent className="p-4 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-violet-300/80">
                These insights are based on your current month&apos;s transactions. Add more transactions for more accurate advice.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {!loading && !fetched && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-20 h-20 mx-auto bg-violet-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-violet-400" />
          </div>
          <p className="font-medium text-foreground">Your AI finance coach is ready</p>
          <p className="text-sm mt-1">Click the button above to get personalized tips based on your spending</p>
        </div>
      )}
    </div>
  );
}
