import { readFile } from "node:fs/promises";
import path from "node:path";

const LEGAL_FILES = {
    terms: "TermsOfService.md",
    privacy: "PrivacyPolicy.md",
    eula: "EULA.md"
} as const;

type LegalDocument = keyof typeof LEGAL_FILES;

export async function getLegalMarkdown(document: LegalDocument): Promise<string | null> {
    const filePath = path.join(process.cwd(), LEGAL_FILES[document]);

    try {
        return await readFile(filePath, "utf-8");
    } catch {
        return null;
    }
}

