import { NextResponse } from "next/server";
import { getAIServiceInfo } from "@/lib/ai";

export async function GET() {
  const aiInfo = getAIServiceInfo();
  return NextResponse.json({
    status: "ok",
    product: "JurisPrism Legal Intelligence",
    version: "1.0.0",
    ai: aiInfo,
    timestamp: new Date().toISOString(),
  });
}
