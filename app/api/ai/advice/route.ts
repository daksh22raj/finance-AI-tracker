import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getFinancialAdvice } from "@/lib/gemini";
import connectDB from "@/lib/db";
import Transaction from "@/models/Transaction";
import { format } from "date-fns";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });

    const topCategories = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }));

    const advice = await getFinancialAdvice({
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      topCategories,
      month: format(now, "MMMM yyyy"),
    });

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("POST /api/ai/advice error:", error);
    return NextResponse.json({ error: "Failed to get advice" }, { status: 500 });
  }
}
