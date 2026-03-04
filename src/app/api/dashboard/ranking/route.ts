import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { getTopOperations } from "@/services/dashboard.service";

export async function GET(request: Request) {
  try {
    const { userId } = await authenticate(request);
    const data = await getTopOperations(userId);
    return NextResponse.json({ data });
  } catch (error) {
    return handleError(error, request);
  }
}
