import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { getSummary } from "@/services/dashboard.service";

export async function GET(request: Request) {
    try {
        const { userId } = await authenticate(request);
        const summary = await getSummary(userId);
        return NextResponse.json(summary);
    } catch (error) {
        return handleError(error, request);
    }
}
