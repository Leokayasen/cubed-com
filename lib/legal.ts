import { readFile } from "node:fs/promises";
import path from "node:path";

const LEGAL_FILES = {
    terms: "TermsOfService.md",
    privacy: "PrivacyPolicy.md",
    eula: "EULA.md"
} as const;

type LegalDocument = keyof typeof LEGAL_FILES;

export async function getLegalMarkdown(document: LegalDocument): Promise<string | null> {
    const candidates = [
        path.join(process.cwd(), LEGAL_FILES[document]),
        path.join(process.cwd(), "docs", LEGAL_FILES[document]),
    ];

    for (const filePath of candidates) {
        try {
            return await readFile(filePath, "utf-8");
        } catch {
            // Try the next candidate location.
        }
    }

    return null;
}

