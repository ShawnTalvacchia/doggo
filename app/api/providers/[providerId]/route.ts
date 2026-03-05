import { NextRequest, NextResponse } from "next/server";
import { getProviderById } from "@/lib/data/providers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> },
) {
  const { providerId } = await params;
  const provider = await getProviderById(providerId);

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  return NextResponse.json({ provider });
}
