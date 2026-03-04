import { problems } from "@/lib/problem-registry";
import { verifyToken } from "@/services/auth.service";
import { extractBearerToken } from "./htp";

function extractCookieToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]*)/);
  return match?.[1] ?? null;
}

export async function authenticate(request: Request) {
  const token = extractBearerToken(request) ?? extractCookieToken(request);
  if (!token) {
    throw problems.invalidToken("Token de autenticação não fornecido");
  }
  return verifyToken(token);
}
