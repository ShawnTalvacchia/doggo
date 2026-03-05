import { NextRequest, NextResponse } from "next/server";
import { getProviderProfileContent } from "@/lib/data/providerContent";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> },
) {
  const { providerId } = await params;
  const content = await getProviderProfileContent(providerId);

  if (!content) {
    return NextResponse.json({ error: "Provider content not found" }, { status: 404 });
  }

  return NextResponse.json({ content });
}
