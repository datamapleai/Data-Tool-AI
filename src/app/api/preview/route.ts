import { NextRequest, NextResponse } from "next/server";
import { previewUrl } from "@/lib/scraping";
import { z } from "zod";

const previewSchema = z.object({
  url: z.string().url(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  const parsed = previewSchema.safeParse({ url });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Valid URL is required" },
      { status: 400 }
    );
  }

  try {
    const result = await previewUrl(parsed.data.url);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Preview failed" },
      { status: 500 }
    );
  }
}
