import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simulasikan pengambilan info dari cookie/session
function getUserRole(req: NextRequest): string | null {
  return req.cookies.get("role")?.value || null;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname === "/") {
    const role = getUserRole(req);
    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const dest =
      {
        admin: "/admin/dashboard",
        koordinator: "/koordinator/dashboard",
        sales: "/sales/dashboard",
      }[role] || "/unauthorized";
    return NextResponse.redirect(new URL(dest, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
