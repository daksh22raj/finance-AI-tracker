import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export function getGeminiModel(modelName = "gemini-2.5-flash") {
  return genAI.getGenerativeModel({ model: modelName });
}

export async function extractReceiptData(base64Image: string, mimeType: string) {
  const model = getGeminiModel("gemini-2.5-flash");

  const prompt = `Analyze this receipt image and extract the following information. Return ONLY valid JSON, with absolutely no markdown formatting, backticks, or other text.
{
  "amount": 0.00,
  "date": "YYYY-MM-DD",
  "description": "Short description",
  "category": "Food",
  "merchant": "Store Name"
}
If you cannot find a value, use null.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Image,
        mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp",
      },
    },
  ]);

  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch {
    throw new Error("Failed to parse AI response: " + text);
  }
}

export async function getFinancialAdvice(summary: {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  topCategories: { name: string; amount: number }[];
  month: string;
}) {
  const model = getGeminiModel();

  const prompt = `You are a personal finance advisor. Based on this financial summary for ${summary.month}:
- Total Income: $${summary.totalIncome.toFixed(2)}
- Total Expenses: $${summary.totalExpenses.toFixed(2)}
- Net Savings: $${summary.savings.toFixed(2)}
- Savings Rate: ${summary.totalIncome > 0 ? ((summary.savings / summary.totalIncome) * 100).toFixed(1) : 0}%
- Top Spending Categories: ${summary.topCategories.map((c) => `${c.name}: $${c.amount.toFixed(2)}`).join(", ")}

Provide 3-5 specific, actionable financial tips in a friendly, encouraging tone. Format as a JSON array of objects:
[{"tip": "<tip title>", "detail": "<one sentence explanation>", "icon": "<emoji>"}]

Return only valid JSON, no markdown.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch {
    return [
      {
        tip: "Track your spending",
        detail: "Review your expenses regularly to stay on budget.",
        icon: "📊",
      },
    ];
  }
}
