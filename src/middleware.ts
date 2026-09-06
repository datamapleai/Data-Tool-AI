import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/setup";

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/resources", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!$|api/auth|api/setup|_next/static|_next/image|favicon.ico).*)"],
};
