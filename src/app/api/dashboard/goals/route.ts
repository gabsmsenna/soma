import { NextResponse } from "next/server";
import { monthlyGoalSchema } from "@/dtos/dashboard.dto";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { problems } from "@/lib/problem-registry";
import { getGoal, upsertGoal } from "@/services/dashboard.service";

export async function GET(request: Request) {
  try {
    const { userId } = await authenticate(request);
    const now = new Date();
    const result = await getGoal(userId, now.getMonth() + 1, now.getFullYear());
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await authenticate(request);
    const body = await request.json();

    const parsed = monthlyGoalSchema.safeParse(body);
    if (!parsed.success) {
      throw problems.validationError("Dados inválidos", {
        fields: parsed.error.flatten().fieldErrors,
      });
    }

    const now = new Date();
    const goal = await upsertGoal(
      userId,
      now.getMonth() + 1,
      now.getFullYear(),
      parsed.data.amount,
    );

    return NextResponse.json(goal);
  } catch (error) {
    return handleError(error, request);
  }
}
