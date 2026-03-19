import { getAllDevlogSlugs, getDevlogPostBySlug } from "@/lib/devlog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Metadata } from "next";

export async function generateStaticParams() {
    const slugs = await getAllDevlogSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getDevlogPostBySlug(slug);

    if (!post) {
        return { title: "Devlog" };
    }

    return {
        title: `${post.meta.title} | Devlog`,
        description: post.meta.summary,
    };
}

export default async function DevlogPostPage({
                                                 params,
                                             }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getDevlogPostBySlug(slug);
    if (!post) return notFound();

    const { content } = await compileMDX({
        source: post.body,
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
            <div>
                <Link href="/devlog" className="text-sm text-zinc-400 hover:text-white">
                    ← Back to Devlog
                </Link>
                <h1 className="mt-3 text-3xl font-semibold">{post.meta.title}</h1>
                <div className="mt-2 text-sm text-zinc-400">{post.meta.date}</div>
            </div>

            <div className="container-soft p-6 md:p-10">
                <div className="prose prose-invert max-w-none devlog-prose">
                    {content}
                </div>
            </div>
        </article>
    );
}
