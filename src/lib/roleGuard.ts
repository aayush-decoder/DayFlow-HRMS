import { jwtVerify, type JWTPayload } from "jose";
import type { NextRequest } from "next/server";


const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JwtUser {
  id: string;
  email: string;
  role: string;
  companyId: string;
}

function isJwtUser(payload: JWTPayload): payload is JWTPayload & JwtUser {
  return (
    typeof payload.id === "string" &&
    typeof payload.email === "string" &&
    typeof payload.role === "string" &&
    typeof payload.companyId === "string"
  );
}

export async function getUserFromRequest(
  req: NextRequest
): Promise<JwtUser | null> {
  try {
    // First try Authorization header (for API calls)
    const authHeader = req.headers.get("authorization");
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
      console.log("🔑 Using Bearer token from Authorization header");
    } else {
      // Fallback to cookie (for web app)
      token = req.cookies.get("token")?.value;
      console.log("🍪 Using token from cookie");
    }
    
    if (!token) {
      console.log("❌ No token found in Authorization header or cookies");
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    console.log("✅ Token verified, payload:", payload);

    if (!isJwtUser(payload)) {
      console.log("❌ Invalid payload structure");
      return null;
    }

    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export function requireRole(
  user: JwtUser | null,
  allowed: string[] = []
): boolean {
  if (!user) return false;
  if (allowed.length === 0) return true;
  return allowed.includes(user.role);
}
