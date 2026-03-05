import { NextResponse } from "next/server";
import { listProviders } from "@/lib/data/providers";

export async function GET() {
  const providers = await listProviders();
  return NextResponse.json({ providers });
}
