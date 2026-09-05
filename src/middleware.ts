import { auth } from "@/lib/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/setup") {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!$|setup|api/auth|api/setup|_next/static|_next/image|favicon.ico).*)"],
};
