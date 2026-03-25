// POST /api/account/logout
import {
    deleteSessionByToken,
    getSessionTokenFromCookieHeader,
    SESSION_COOKIE_NAME,
} from "@/lib/server/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const token = getSessionTokenFromCookieHeader(request.headers.get("cookie"));

    if (token) {
        await deleteSessionByToken(token).catch(() => {});
    }

    const response = NextResponse.json({ ok: true });
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
