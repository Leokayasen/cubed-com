const WEBHOOK_TIMEOUT_MS = 8000;

export async function sendDiscordMessage(webhookUrl: string, content: string): Promise<boolean> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
            signal: controller.signal,
        });

        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}

