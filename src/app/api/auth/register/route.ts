import { NextResponse } from "next/server";
import z from "zod";
import { registerSchema } from "@/dtos/register.dto";
import { handleError } from "@/lib/error-handler";
import { register } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }

    const { user, token } = await register(parsedData.data);

    const response = NextResponse.json({ user, token }, { status: 201 });

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
