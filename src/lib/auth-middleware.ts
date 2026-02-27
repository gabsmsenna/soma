import { verifyToken } from "@/services/auth.service";
import { extractBearerToken } from "./htp";

export async function authenticate(request: Request) {
  const token = extractBearerToken(request);
  if (!token) {
    throw Object.assign(new Error("INVALID_TOKEN"), { status: 401 });
  }
  return verifyToken(token);
}
