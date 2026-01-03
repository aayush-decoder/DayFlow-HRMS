import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
  employeeId?: string;
  companyId?: string;
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

export function getAuth(req: Request): AuthPayload {
  // Extract token from cookie header
  const cookieHeader = req.headers.get('cookie');

  if (!cookieHeader) {
    throw new Error("Unauthorized: No cookies found");
  }

  // Parse cookies manually
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const token = cookies['token'];

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const payload = verifyToken(token);

  if (!payload) {
    throw new Error("Unauthorized: Invalid token");
  }

  return payload;
}
