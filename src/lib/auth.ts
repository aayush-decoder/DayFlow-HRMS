import bcrypt from "bcrypt";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

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

// Updated getAuth function to work with the new jose-based authentication
export async function getAuth(req: Request): Promise<LegacyAuthPayload> {
  // Try to get token from Authorization header first (for API clients)
  const authHeader = req.headers.get("authorization");
  let token: string | undefined;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7); // Remove "Bearer " prefix
  } else {
    // Try to get token from cookie (for web app)
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      token = cookies.token;
    }
  }

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.userId || !payload.role || !payload.companyId) {
      throw new Error("Invalid token payload");
    }

    // For employees, we need to get their employee ID from the database
    let employeeId: string | null = null;
    if (payload.role === "EMPLOYEE") {
      const employee = await prisma.employee.findUnique({
        where: { userId: payload.userId as string },
        select: { id: true }
      });
      employeeId = employee?.id || null;
      
      if (!employeeId) {
        throw new Error("Employee record not found. Please contact your administrator.");
      }
    }

    return {
      userId: payload.userId as string,
      role: payload.role as string,
      companyId: payload.companyId as string,
      employeeId
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Unauthorized");
  }
}
