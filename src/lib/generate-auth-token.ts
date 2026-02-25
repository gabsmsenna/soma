import { SignJWT } from "jose";

export async function generateAuthToken(
  userId: string,
  email: string,
): Promise<string> {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new Error("A variável de ambiente JWT_SECRET não está definida.");
  }

  const secret = new TextEncoder().encode(secretKey);
  const alg = "HS256";

  return await new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}
