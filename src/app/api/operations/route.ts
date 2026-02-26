import { NextResponse } from "next/server";
import z from "zod";
import { createOperationSchema } from "@/dtos/operation.dto";
import { AuthService } from "@/services/auth.service";
import { OperationService } from "@/services/operation.service";

function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await AuthService.verifyToken(token);
    const operations = await OperationService.getAll(userId);
    return NextResponse.json(operations);
  } catch (error) {
    console.error("Erro ao listar operações:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await AuthService.verifyToken(token);
    const body = await request.json();
    const parsedData = createOperationSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }
    const operation = await OperationService.create(userId, parsedData.data);
    return NextResponse.json(operation, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar operação:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
