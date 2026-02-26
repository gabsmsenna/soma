import { NextResponse } from "next/server";
import z from "zod";
import { updateOperationSchema } from "@/dtos/operation.dto";
import { AuthService } from "@/services/auth.service";
import { OperationService } from "@/services/operation.service";

function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await AuthService.verifyToken(token);
    const body = await request.json();
    const parsedData = updateOperationSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsedData.error) },
        { status: 400 },
      );
    }
    const operation = await OperationService.update(
      params.id,
      userId,
      parsedData.data,
    );
    return NextResponse.json(operation);
  } catch (error) {
    console.error("Erro ao atualizar operação:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "OPERATION_NOT_FOUND") {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { userId } = await AuthService.verifyToken(token);
    await OperationService.delete(params.id, userId);
    return NextResponse.json({ message: "Operação deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar operação:", error);
    if (error instanceof Error && error.message === "INVALID_TOKEN") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "OPERATION_NOT_FOUND") {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
