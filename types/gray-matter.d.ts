declare module "gray-matter" {
    type GrayMatterFile<T extends Record<string, unknown> = Record<string, unknown>> = {
        content: string;
        data: T;
    };

    export default function matter<T extends Record<string, unknown> = Record<string, unknown>>(
        input: string
    ): GrayMatterFile<T>;
}

