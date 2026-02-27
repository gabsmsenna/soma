import { NextResponse } from "next/server";
import { AppError } from "./app-error";

interface ProblemDetailsResponse {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

export function handleError(error: unknown, request: Request): NextResponse {
  if (error instanceof AppError) {
    const body: ProblemDetailsResponse = {
      type: error.type,
      title: error.title,
      status: error.status,
      ...(error.detail && { detail: error.detail }),
      instance: new URL(request.url).pathname,
      ...error.extensions,
    };

    console.error(`[${error.status}] ${error.title}:`, error.detail ?? "");

    return new NextResponse(JSON.stringify(body), {
      status: error.status,
      headers: { "Content-Type": "application/problem+json" },
    });
  }

  console.error("[500] Erro não tratado:", error);

  const body: ProblemDetailsResponse = {
    type: "https://soma.api/problems/internal-error",
    title: "Erro interno do servidor",
    status: 500,
    instance: new URL(request.url).pathname,
  };

  return new NextResponse(JSON.stringify(body), {
    status: 500,
    headers: { "Content-Type": "application/problem+json" },
  });
}
