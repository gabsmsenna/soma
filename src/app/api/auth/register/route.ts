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

    const newUser = await register(parsedData.data);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return handleError(error, request);
  }
}
