import { NextRequest, NextResponse } from "next/server";
import { translateText, TranslatorInputSchema } from "@/lib/ai/translator";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input using Zod
    const validationResult = TranslatorInputSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { text, targetLanguage } = validationResult.data;

    // Call the service
    const translation = await translateText({ text, targetLanguage });

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
