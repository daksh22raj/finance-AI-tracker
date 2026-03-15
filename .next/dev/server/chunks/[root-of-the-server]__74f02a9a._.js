module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/NextJs-AiFT/lib/gemini.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractReceiptData",
    ()=>extractReceiptData,
    "getFinancialAdvice",
    ()=>getFinancialAdvice,
    "getGeminiModel",
    ()=>getGeminiModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/NextJs-AiFT/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY);
function getGeminiModel(modelName = "gemini-2.5-flash") {
    return genAI.getGenerativeModel({
        model: modelName
    });
}
async function extractReceiptData(base64Image, mimeType) {
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
                mimeType: mimeType
            }
        }
    ]);
    const text = result.response.text();
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(text);
    } catch  {
        throw new Error("Failed to parse AI response: " + text);
    }
}
async function getFinancialAdvice(summary) {
    const model = getGeminiModel();
    const prompt = `You are a personal finance advisor. Based on this financial summary for ${summary.month}:
- Total Income: $${summary.totalIncome.toFixed(2)}
- Total Expenses: $${summary.totalExpenses.toFixed(2)}
- Net Savings: $${summary.savings.toFixed(2)}
- Savings Rate: ${summary.totalIncome > 0 ? (summary.savings / summary.totalIncome * 100).toFixed(1) : 0}%
- Top Spending Categories: ${summary.topCategories.map((c)=>`${c.name}: $${c.amount.toFixed(2)}`).join(", ")}

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
    } catch  {
        return [
            {
                tip: "Track your spending",
                detail: "Review your expenses regularly to stay on budget.",
                icon: "📊"
            }
        ];
    }
}
}),
"[project]/Desktop/NextJs-AiFT/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/NextJs-AiFT/node_modules/mongoose)");
;
const cached = global.mongoose || {
    conn: null,
    promise: null
};
if (!global.mongoose) {
    global.mongoose = cached;
}
async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts);
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/Desktop/NextJs-AiFT/models/Transaction.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Desktop/NextJs-AiFT/node_modules/mongoose)");
;
const TransactionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$mongoose$29$__["Schema"]({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            "income",
            "expense"
        ],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    receiptUrl: {
        type: String
    }
}, {
    timestamps: true
});
TransactionSchema.index({
    userId: 1,
    date: -1
});
TransactionSchema.index({
    userId: 1,
    type: 1
});
TransactionSchema.index({
    userId: 1,
    category: 1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$mongoose$29$__["default"].models.Transaction || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$mongoose$29$__["default"].model("Transaction", TransactionSchema);
}),
"[project]/Desktop/NextJs-AiFT/app/api/ai/advice/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/NextJs-AiFT/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/NextJs-AiFT/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/NextJs-AiFT/lib/gemini.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/NextJs-AiFT/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$models$2f$Transaction$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/NextJs-AiFT/models/Transaction.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/NextJs-AiFT/node_modules/date-fns/format.js [app-route] (ecmascript) <locals>");
;
;
;
;
;
;
async function POST() {
    try {
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 401
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        const transactions = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$models$2f$Transaction$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).lean();
        const totalIncome = transactions.filter((t)=>t.type === "income").reduce((sum, t)=>sum + t.amount, 0);
        const totalExpenses = transactions.filter((t)=>t.type === "expense").reduce((sum, t)=>sum + t.amount, 0);
        const categoryMap = {};
        transactions.filter((t)=>t.type === "expense").forEach((t)=>{
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });
        const topCategories = Object.entries(categoryMap).sort(([, a], [, b])=>b - a).slice(0, 5).map(([name, amount])=>({
                name,
                amount
            }));
        const advice = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFinancialAdvice"])({
            totalIncome,
            totalExpenses,
            savings: totalIncome - totalExpenses,
            topCategories,
            month: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(now, "MMMM yyyy")
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            advice
        });
    } catch (error) {
        console.error("POST /api/ai/advice error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$NextJs$2d$AiFT$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to get advice"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__74f02a9a._.js.map