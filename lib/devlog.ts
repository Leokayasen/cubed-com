import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

type MatterResult = {
    content: string;
    data: Record<string, unknown>;
};

// Use require here to avoid gray-matter module typing issues with bundler resolution.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const matter = require("gray-matter") as (input: string) => MatterResult;

const DEVLOG_DIRECTORY = path.join(process.cwd(), "content", "devlog");

type DevlogFrontmatter = {
    title: string;
    date: string; // ISO
    summary: string;
};

export type DevlogPost = DevlogFrontmatter & {
    slug: string;
};

export type DevlogPostContent = {
    meta: DevlogPost;
    body: string;
};

function parsePostFromFile(fileName: string, fileContents: string): DevlogPostContent {
    const slug = fileName.replace(/\.mdx$/, "");
    const { content, data } = matter(fileContents);

    return {
        meta: {
            slug,
            title: String(data.title ?? "Untitled"),
            date: String(data.date ?? "1970-01-01"),
            summary: String(data.summary ?? ""),
        },
        body: content,
    };
}

export async function getAllDevlogPosts(): Promise<DevlogPost[]> {
    const files = await readdir(DEVLOG_DIRECTORY);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));
    const posts = await Promise.all(
        mdxFiles.map(async (fileName) => {
            const fullPath = path.join(DEVLOG_DIRECTORY, fileName);
            const contents = await readFile(fullPath, "utf-8");
            const { meta } = parsePostFromFile(fileName, contents);
            return meta;
        })
    );

    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAllDevlogSlugs(): Promise<string[]> {
    const posts = await getAllDevlogPosts();
    return posts.map((post) => post.slug);
}

export async function getDevlogPostBySlug(slug: string): Promise<DevlogPostContent | null> {
    const filePath = path.join(DEVLOG_DIRECTORY, `${slug}.mdx`);

    try {
        const contents = await readFile(filePath, "utf-8");
        return parsePostFromFile(`${slug}.mdx`, contents);
    } catch {
        return null;
    }
}
