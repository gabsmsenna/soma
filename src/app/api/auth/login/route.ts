import { NextResponse } from "next/server";
import z from "zod";
import { loginSchema } from "@/dtos/login.dto";
import { AuthService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsedData = loginSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const { user, token } = await AuthService.login(parsedData.data);

    return NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: user,
        token,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
