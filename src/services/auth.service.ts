import bcrypt from "bcryptjs";
import { generateAuthToken } from "@/lib/generate-auth-token";
import { RegisterDto } from "@/dtos/register.dto";
import prisma from "@/lib/prisma";
import { LoginDto } from "@/dtos/login.dto";

export class AuthService {
  static async register(data: RegisterDto) {
    const { email, password, name, cpf } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw { message: "E-mail já cadastrado", status: 409 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, cpf, password: hashedPassword },
    });

    const token = await generateAuthToken(user.id, user.email);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async login({ email, password }: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = await generateAuthToken(user.id, user.email);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
