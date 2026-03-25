export type RequestMeta = {
    ip: string | null;
    userAgent: string | null;
};

export function getRequestMeta(request: Request): RequestMeta {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : null;
    const userAgent = request.headers.get("user-agent");
    return { ip, userAgent };
}
