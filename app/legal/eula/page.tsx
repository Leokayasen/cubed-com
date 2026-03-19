import { getLegalMarkdown } from "@/lib/legal";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default async function EulaPage() {
    const source = await getLegalMarkdown("eula");
    if (!source) return notFound();

    const { content } = await compileMDX({
        source,
        options: {
            parseFrontmatter: false,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSanitize],
            },
        },
    });

    return (
        <article className="grid gap-6">
            <div className="container-soft p-6 md:p-10">
                <div className="prose prose-invert max-w-none devlog-prose">{content}</div>
            </div>
        </article>
    );
}
