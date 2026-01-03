import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

interface JwtUser {
  id: string;
  email: string;
  role: string;
}

function isJwtUser(payload: JWTPayload): payload is JWTPayload & JwtUser {
  return (
    typeof payload.id === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string"
  );
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!isJwtUser(payload)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }


    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      payload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}


export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
