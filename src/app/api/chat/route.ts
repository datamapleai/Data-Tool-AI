import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { chatCompletion, getCatalogContext } from "@/lib/providers";
import { z } from "zod";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const catalogContext = await getCatalogContext(session.user.id);

    const systemMessage = {
      role: "system" as const,
      content: `You are a helpful assistant for the user's personal bookmark catalog. You can help them find, organize, and learn about their saved resources.\n\n${catalogContext}`,
    };

    const messages = [
      systemMessage,
      ...parsed.data.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const result = await chatCompletion(session.user.id, messages);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat failed" },
      { status: 500 }
    );
  }
}
