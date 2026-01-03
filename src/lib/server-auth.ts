import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "change_this");

export async function getServerAuth() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return null

    const { payload } = await jwtVerify(token, secret);
    
    // Handle backward compatibility: old tokens use 'id', new ones use 'userId'
    const userId = (payload.userId || payload.id) as string;
    
    if (!userId || !payload.role || !payload.companyId) {
      return null;
    }

    return {
      userId,
      email: payload.email as string,
      role: payload.role as string,
      companyId: payload.companyId as string,
    };
  } catch (error) {
    console.error("Server auth verification failed:", error);
    return null;
  }
}
