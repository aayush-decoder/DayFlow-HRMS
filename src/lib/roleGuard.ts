import { jwtVerify, type JWTPayload } from "jose";
import type { NextRequest } from "next/server";


const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JwtUser {
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

export async function getUserFromRequest(
  req: NextRequest
): Promise<JwtUser | null> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);

    if (!isJwtUser(payload)) {
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
