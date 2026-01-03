import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
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
