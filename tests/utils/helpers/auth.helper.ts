import { SignJWT } from "jose";

export interface TestTokenPayload {
  sub: string;
  email: string;
}

export async function generateTestAuthToken(
  payload: TestTokenPayload,
  expiresIn = "1d",
): Promise<string> {
  const secretKey = process.env.JWT_SECRET || "test-secret-key";
  const secret = new TextEncoder().encode(secretKey);
  const alg = "HS256";

  return await new SignJWT({ sub: payload.sub, email: payload.email })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function generateExpiredTestToken(
  payload: TestTokenPayload,
): Promise<string> {
  const secretKey = process.env.JWT_SECRET || "test-secret-key";
  const secret = new TextEncoder().encode(secretKey);
  const alg = "HS256";

  return await new SignJWT({ sub: payload.sub, email: payload.email })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("0s")
    .sign(secret);
}

export function createAuthHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}
