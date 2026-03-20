import {
    getAccountFromSessionToken,
    getSessionTokenFromCookieHeader,
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
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });
        return response;
    }

    return NextResponse.json({
        ok: true,
        authenticated: true,
        account: session.account,
        session: {
            id: session.sessionId,
            expiresAt: session.expiresAt,
        },
    });
}

