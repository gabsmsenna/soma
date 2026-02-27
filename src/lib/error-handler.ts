import { NextResponse } from "next/server";

export function handleError(error: unknown, context: string): NextResponse {
  console.error(context, error);

  if (error instanceof Error) {
    if (error.message === "INVALID_TOKEN")
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    if (error.message === "OPERATION_NOT_FOUND")
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
