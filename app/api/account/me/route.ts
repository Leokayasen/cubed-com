// GET /api/account/me
import {
    getAccountFromSessionToken,
    getSessionTokenFromCookieHeader,
    refreshSessionIfNeeded,
    SESSION_COOKIE_NAME,
} from "@/lib/server/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const token = getSessionTokenFromCookieHeader(request.headers.get("cookie"));

    if (!token) {
        return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
    }

    const session = await getAccountFromSessionToken(token);
    if (!session) {
        const response = NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
        response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: "",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });
        return response;
    }

    // Slide session expiry if needed
    const newExpiry = await refreshSessionIfNeeded(session.sessionId, session.expiresAt);

    const response = NextResponse.json({
        ok: true,
        authenticated: true,
        account: session.account,
        session: {
            id: session.sessionId,
            expiresAt: (newExpiry ?? session.expiresAt).toISOString(),
        },
    });

    if (newExpiry) {
        response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            expires: newExpiry,
        });
    }

    return response;
}
