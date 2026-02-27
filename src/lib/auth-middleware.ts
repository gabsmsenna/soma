import { problems } from "@/lib/problem-registry";
import { verifyToken } from "@/services/auth.service";
import { extractBearerToken } from "./htp";

export async function authenticate(request: Request) {
  const token = extractBearerToken(request);
  if (!token) {
    throw problems.invalidToken("Token de autenticação não fornecido");
  }
  return verifyToken(token);
}
