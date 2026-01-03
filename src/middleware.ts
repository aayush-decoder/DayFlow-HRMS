import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface JwtUser {
  userId: string;
  email: string;
  role: string;
}

function isJwtUser(payload: JWTPayload): payload is JWTPayload & JwtUser {
  return (
    typeof payload.userId === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
  );
}

export async function middleware(req: NextRequest) {
  console.log("🔒 Middleware checking:", req.nextUrl.pathname);
  const token = req.cookies.get("token")?.value;
  console.log("🍪 Token found:", !!token);
  console.log("🍪 Token value (first 20 chars):", token?.substring(0, 20));

  if (!token) {
    console.log("❌ No token - redirecting to login");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("✅ Token verified, payload:", payload);

    if (!isJwtUser(payload)) {
      console.log("❌ Invalid payload structure");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("👤 User role:", payload.role);

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      payload.role !== "ADMIN"
    ) {
      console.log("⛔ Non-admin trying to access admin route");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    console.log("✅ Access granted");
    return NextResponse.next();
  } catch (error) {
    console.log("❌ Token verification failed:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
