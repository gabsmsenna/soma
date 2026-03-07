import { cookies } from "next/headers";
import { verifyToken } from "@/services/auth.service";

export async function getServerSession(): Promise<{
  userId: string;
  email: string;
  name: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token");
    if (!tokenCookie?.value) return null;
    return await verifyToken(tokenCookie.value);
  } catch {
    return null;
  }
}
