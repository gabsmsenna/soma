import { SignJWT } from "jose";

async function main() {
  const secretKey = process.env.JWT_SECRET || "fallback_secret";
  const secret = new TextEncoder().encode(secretKey);

  const token = await new SignJWT({
    sub: "test-user-id",
    email: "test@example.com",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);

  console.log(token);
}

main();
