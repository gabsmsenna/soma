"use server";

import { revalidatePath } from "next/cache";
import { monthlyGoalSchema } from "@/dtos/dashboard.dto";
import { problems } from "@/lib/problem-registry";
import { getServerSession } from "@/lib/session";
import { upsertGoal } from "@/services/dashboard.service";

export async function setMonthlyGoal(amount: number): Promise<void> {
  const session = await getServerSession();
  if (!session) throw problems.invalidToken();

  const parsed = monthlyGoalSchema.safeParse({ amount });
  if (!parsed.success) {
    throw problems.validationError(
      parsed.error.issues[0]?.message ?? "Dados inválidos",
    );
  }

  const now = new Date();
  await upsertGoal(
    session.userId,
    now.getMonth() + 1,
    now.getFullYear(),
    parsed.data.amount,
  );

  revalidatePath("/dashboard");
}
