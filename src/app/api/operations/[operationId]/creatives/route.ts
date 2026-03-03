import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth-middleware";
import { handleError } from "@/lib/error-handler";
import { verifyOperationOwnership } from "@/services/operation.service";

type RouteContext = { params: Promise<{ operationId: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { operationId } = await params;
    const { userId } = await authenticate(request);
    await verifyOperationOwnership(operationId, userId);

    return NextResponse.json(
      { error: "Endpoint movido. Use /projects/:projectId/creatives" },
      { status: 410 },
    );
  } catch (error) {
    return handleError(error, request);
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { operationId } = await params;
    const { userId } = await authenticate(request);
    await verifyOperationOwnership(operationId, userId);

    return NextResponse.json(
      { error: "Endpoint movido. Use /projects/:projectId/creatives" },
      { status: 410 },
    );
  } catch (error) {
    return handleError(error, request);
  }
}
