// ---------------------------------------------------------------------------
// Email service
// Abstracted behind a simple interface — swap Resend for any other provider
// by changing the sendEmail implementation only.
//
// Setup:
//   npm install resend
//   Add RESEND_API_KEY and EMAIL_FROM to your .env
// ---------------------------------------------------------------------------

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Cubed <noreply@bitwave-studios.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cubed.bitwave-studios.com";

type EmailPayload = {
    to: string;
    subject: string;
    html: string;
    text: string;
};

async function sendEmail(payload: EmailPayload): Promise<void> {
    if (!RESEND_API_KEY) {
        // In development without a key, log to console instead of throwing.
        if (process.env.NODE_ENV !== "production") {
            console.log("[Email - dev]", payload.subject, "→", payload.to);
            console.log(payload.text);
            return;
        }
        throw new Error("RESEND_API_KEY is not configured.");
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: EMAIL_FROM,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
        }),
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Resend API error ${res.status}: ${body}`);
    }
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

export async function sendVerificationEmail(params: {
    to: string;
    username: string;
    token: string;
}): Promise<void> {
    const url = `${SITE_URL}/account/verify-email?token=${params.token}`;

    await sendEmail({
        to: params.to,
        subject: "Verify your Cubed account",
        text: `Hi ${params.username},\n\nVerify your email to activate your Cubed account:\n${url}\n\nThis link expires in 24 hours.\n\nIf you didn't create an account, you can ignore this email.`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;background:#09090b;color:#fafafa;padding:32px;margin:0">
  <div style="max-width:480px;margin:0 auto">
    <h1 style="font-size:22px;font-weight:600;margin-bottom:8px">Verify your email</h1>
    <p style="color:#a1a1aa;margin-bottom:24px">Hi ${params.username}, click below to activate your Cubed account.</p>
    <a href="${url}" style="display:inline-block;background:#fff;color:#09090b;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none">
      Verify email address
    </a>
    <p style="color:#52525b;font-size:12px;margin-top:24px">Link expires in 24 hours. If you didn't create an account, ignore this email.</p>
    <p style="color:#3f3f46;font-size:12px">Or paste this URL into your browser:<br>${url}</p>
  </div>
</body>
</html>`,
    });
}

export async function sendPasswordResetEmail(params: {
    to: string;
    username: string;
    token: string;
}): Promise<void> {
    const url = `${SITE_URL}/account/reset-password?token=${params.token}`;

    await sendEmail({
        to: params.to,
        subject: "Reset your Cubed password",
        text: `Hi ${params.username},\n\nReset your Cubed password:\n${url}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, your account is safe — ignore this email.`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;background:#09090b;color:#fafafa;padding:32px;margin:0">
  <div style="max-width:480px;margin:0 auto">
    <h1 style="font-size:22px;font-weight:600;margin-bottom:8px">Reset your password</h1>
    <p style="color:#a1a1aa;margin-bottom:24px">Hi ${params.username}, click below to set a new password.</p>
    <a href="${url}" style="display:inline-block;background:#fff;color:#09090b;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none">
      Reset password
    </a>
    <p style="color:#52525b;font-size:12px;margin-top:24px">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
    <p style="color:#3f3f46;font-size:12px">Or paste this URL:<br>${url}</p>
  </div>
</body>
</html>`,
    });
}
