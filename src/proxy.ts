import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

// Routes that do not require authentication
const publicRoutes = ["/login"];
const publicApiRoutes = ["/api/auth/login", "/api/auth/register"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's a public route
    if (
        publicRoutes.includes(pathname) ||
        publicApiRoutes.includes(pathname)
    ) {
        return NextResponse.next();
    }

    // Get token from cookie
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return handleUnauthorized(request);
    }

    try {
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("JWT_SECRET environment variable is not defined");
            return handleUnauthorized(request);
        }

        const secret = new TextEncoder().encode(secretKey);
        // jwtVerify from 'jose' supports Edge Runtime
        await jwtVerify(token, secret);

        // Token is valid, proceed
        return NextResponse.next();
    } catch (error) {
        // Token is invalid or expired
        console.error("Middleware token verification failed:", error);
        return handleUnauthorized(request);
    }
}

function handleUnauthorized(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Return JSON for API routes
    if (pathname.startsWith("/api/")) {
        return NextResponse.json(
            { error: "Não autorizado", detail: "Token ausente ou inválido" },
            { status: 401 }
        );
    }

    // Redirect to login for pages, preserving the intended destination if it's not the root
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
        loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
}

// Ensure middleware only runs on relevant paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
