import { NextResponse } from "next/server";
import { commissionsPeriodSchema } from "@/dtos/dashboard.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { problems } from "@/lib/problem-registry";
import { getCommissionsChart } from "@/services/dashboard.service";

export async function GET(request: Request) {
  try {
    const { userId } = await authenticate(request);

    const { searchParams } = new URL(request.url);
    const parsed = commissionsPeriodSchema.safeParse({
      period: searchParams.get("period"),
    });

    if (!parsed.success) {
      throw problems.validationError("Dados inválidos", {
        fields: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await getCommissionsChart(userId, parsed.data.period);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error, request);
  }
}
