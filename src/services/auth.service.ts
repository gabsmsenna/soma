import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import type { LoginDto } from "@/dtos/login.dto";
import type { RegisterDto } from "@/dtos/register.dto";
import { generateAuthToken } from "@/lib/generate-auth-token";
import prisma from "@/lib/prisma";
import { problems } from "@/lib/problem-registry";

export async function register(data: RegisterDto) {
  const { email, password, name, cpf } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw problems.emailAlreadyExists();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, cpf, password: hashedPassword },
  });

  const token = await generateAuthToken(user.id, user.email);
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
}

export async function login({ email, password }: LoginDto) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw problems.invalidCredentials();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw problems.invalidCredentials();
  }

  const token = await generateAuthToken(user.id, user.email);

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
}

export async function verifyToken(
  token: string,
): Promise<{ userId: string; email: string }> {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET not defined");
  }
  const secret = new TextEncoder().encode(secretKey);
  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.sub as string, email: payload.email as string };
  } catch (error) {
    console.error("Token verification failed:", error);
    throw problems.invalidToken();
  }
}
