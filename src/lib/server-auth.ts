import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getServerAuth() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return null
    
    const { payload } = await jwtVerify(token, secret);
    
    if (!payload.userId || !payload.role || !payload.companyId) {
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      companyId: payload.companyId as string,
    };
  } catch (error) {
    console.error("Server auth verification failed:", error);
    return null;
  }
}
