import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { canCreateAdmin, isInstalled, markInstalled } from "@/lib/setup";
import { z } from "zod";

const setupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const allowed = await canCreateAdmin();
    if (!allowed) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = setupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: { name, email, passwordHash },
    });

    await db.userSettings.create({
      data: { userId: user.id },
    });

    await markInstalled();

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const installed = await isInstalled();
    const canCreate = await canCreateAdmin();

    return NextResponse.json({
      installed,
      canCreateAdmin: canCreate,
    });
  } catch (error) {
    console.error("Setup GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
