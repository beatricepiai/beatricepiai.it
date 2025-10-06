import fs from "fs";
import path from "path";

const { VERCEL_ENV } = process.env;

// Exit if not production
if (VERCEL_ENV !== "production") {
    process.exit(0);
}

type Replacement = { search: string; replace: string };
type FileTask = { file: string; replacements: Replacement[] };

const tasks: FileTask[] = [
    {
        file: "src/lib/storyblokUtils.ts",
        replacements: [
            { search: "const isProd = false;", replace: "const isProd = true;" }
        ]
    },
    {
        file: "src/components/BlocksLoop.tsx",
        replacements: [
            { search: "const isProd = false;", replace: "const isProd = true;" }
        ]
    },
    {
        file: "src/app/robots.ts",
        replacements: [
            { search: "const isProd = false;", replace: "const isProd = true;" }
        ]
    },
    {
        file: "src/app/api/revalidate/route.ts",
        replacements: [
            { search: "const isProd = false;", replace: "const isProd = true;" }
        ]
    },
    {
        file: "src/app/page.tsx",
        replacements: [
            { search: "export const revalidate = 0;", replace: "" },
        ],
    },
    {
        file: "src/app/[locale]/(with-layout)/[[...slug]]/page.tsx",
        replacements: [
            { search: "const isProd = false;", replace: "const isProd = true;" },
            { search: "export const revalidate = 0;", replace: "" },
        ],
    },
    {
        file: "src/app/[locale]/(no layout)/main-header/page.tsx",
        replacements: [
            { search: "export const revalidate = 0;", replace: "" },
        ],
    },
    {
        file: "src/app/[locale]/(no layout)/main-footer/page.tsx",
        replacements: [
            { search: "export const revalidate = 0;", replace: "" },
        ],
    },
];

for (const task of tasks) {
    const filePath = path.resolve(process.cwd(), task.file);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }
    let content = fs.readFileSync(filePath, "utf8");
    for (const { search, replace } of task.replacements) {
        content = content.replace(search, replace);
    }
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated: ${task.file}`);
}
