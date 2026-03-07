import { NextResponse } from "next/server";
import { handleError } from "@/lib/error-handler";
import { getServerSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json(
      { user: { name: session.name, email: session.email } },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, request);
  }
}
