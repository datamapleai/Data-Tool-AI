import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/login", "/setup"];
  const isPublicApi = pathname.startsWith("/api/auth") || pathname.startsWith("/api/setup");
  const isStatic = pathname.startsWith("/_next") || pathname.endsWith(".ico");

  if (isPublicApi || isStatic) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/resources", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|favicon\\.ico$).*)"],
};
