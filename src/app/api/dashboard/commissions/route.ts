import { NextResponse } from "next/server";
import z from "zod";
import { commissionsPeriodSchema } from "@/dtos/dashboard.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { getCommissionsChart } from "@/services/dashboard.service";

export async function GET(request: Request) {
  try {
    const { userId } = await authenticate(request);

    const { searchParams } = new URL(request.url);
    const parsed = commissionsPeriodSchema.safeParse({
      period: searchParams.get("period"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const result = await getCommissionsChart(userId, parsed.data.period);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error, request);
  }
}
