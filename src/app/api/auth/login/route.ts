import { NextResponse } from "next/server";
import z from "zod";
import { loginSchema } from "@/dtos/login.dto";
import { handleError } from "@/lib/error-handler";
import { login } from "@/services/auth.service";

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

    const { user, token } = await login(parsedData.data);

    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: user,
        token,
      },
      { status: 200 },
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return handleError(error, request);
  }
}
