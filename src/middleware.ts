import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths yang boleh tanpa login
  const publicPaths = ["/login"];
  const isPublicPath =
    publicPaths.includes(pathname) || pathname.startsWith("/api/auth");

  if (isPublicPath) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Jika tidak ada token, redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const roles = Array.isArray(token.roles) ? token.roles : [];
  const roleName = roles[0]?.name as string | undefined;

  // Redirect "/" ke "/dashboard"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Akses path berdasarkan role
  const allowedPaths: Record<string, (path: string) => boolean> = {
    superadmin: () => true, // semua akses
    coordinator: (path) =>
      path.startsWith("/dashboard") ||
      path.startsWith("/cust-management") ||
      path.startsWith("/sales-operation") ||
      path.startsWith("/sales-management"),
    sales: (path) =>
      path.startsWith("/dashboard") ||
      path.startsWith("/cust-management") ||
      (path.startsWith("/sales-operation") &&
        !path.startsWith("/sales-operation/sales") &&
        !path.startsWith("/sales-operation/sales-target-funding")) ||
      path.startsWith("/sales-management"),
  };

  const checkAccess = allowedPaths[roleName ?? ""];

  if (typeof checkAccess === "function" && !checkAccess(pathname)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cust-management/:path*",
    "/sales-operation/:path*",
    "/sales-management/:path*",
    "/superadmin/:path*",
    "/coordinator/:path*",
    "/sales/:path*",
    "/", // root redirect ke dashboard
  ],
};