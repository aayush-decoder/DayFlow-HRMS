import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

// Legacy interface for backward compatibility with attendance APIs
export interface LegacyAuthPayload {
  userId: string;
  role: string;
  companyId: string;
  employeeId: string | null;
}

export const hashPassword = async (
  plain: string
): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
};

export const comparePassword = async (
  plain: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

export const generateToken = (
  payload: AuthPayload,
  opts: SignOptions = { expiresIn: "7d" }
): string => {
  return jwt.sign(payload, JWT_SECRET, opts);
};

export const verifyToken = (
  token: string
): AuthPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
};

// Legacy getAuth function for backward compatibility with attendance APIs
export function getAuth(req: Request): LegacyAuthPayload {
  // DEV MODE OVERRIDE (TEMPORARY) // testing
  if (process.env.NODE_ENV !== "production") {
    const devUser = req.headers.get("x-dev-user")

    if (devUser === "employee") {
      return {
        userId: "dev-user-emp",
        role: "EMPLOYEE",
        companyId: "550e8400-e29b-41d4-a716-446655440000",
        employeeId: "dev-employee"
      }
    }

    if (devUser === "admin") {
      return {
        userId: "dev-user-admin",
        role: "ADMIN",
        companyId: "550e8400-e29b-41d4-a716-446655440000",
        employeeId: null
      }
    }
  }

  // Try to get token from Authorization header first (for API clients)
  const authHeader = req.headers.get("authorization")
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "")
    const payload = verifyToken(token)
    
    if (!payload) throw new Error("Unauthorized")

    return {
      userId: payload.id,
      role: payload.role,
      companyId: "550e8400-e29b-41d4-a716-446655440000", // Default company for now
      employeeId: payload.role === "EMPLOYEE" ? payload.id : null
    }
  }

  // Try to get token from cookie (for web app)
  const cookieHeader = req.headers.get("cookie")
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    const token = cookies.token
    if (token) {
      const payload = verifyToken(token)
      
      if (!payload) throw new Error("Unauthorized")

      return {
        userId: payload.id,
        role: payload.role,
        companyId: "550e8400-e29b-41d4-a716-446655440000", // Default company for now
        employeeId: payload.role === "EMPLOYEE" ? payload.id : null
      }
    }
  }

  throw new Error("Unauthorized")
}
