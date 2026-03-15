import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { extractReceiptData } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { base64Image, mimeType } = body;

    if (!base64Image || !mimeType) {
      return NextResponse.json(
        { error: "Missing base64Image or mimeType" },
        { status: 400 }
      );
    }

    const extracted = await extractReceiptData(base64Image, mimeType);

    return NextResponse.json({ data: extracted });
  } catch (error) {
    console.error("POST /api/ai/scan-receipt error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scan receipt. Please try again." },
      { status: 500 }
    );
  }
}
