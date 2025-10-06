import { getServerSideSitemap } from "next-sitemap";
import { ISitemapField } from "next-sitemap";
import { ISbStoryData } from "storyblok-js-client";
import { getAllStories, ISbStoriesResult } from "@/lib/storyblokUtils";

// attempt to fix sitemap.xml throwing error
// 500 in prod. https://github.com/vercel/next.js/issues/43157#issuecomment-1396330368
export const dynamic = "force-static";

export async function GET(request: Request) {
  const allStories: ISbStoriesResult = await getAllStories({
    excluding_slugs: "service-pages*",
    excluding_fields: "content",
  });

  const host = process.env.DOMAIN_URL || "";

  let result: ISitemapField[] = [];

  // manually push HP: we don't want the /home slug in sitemap
  result.push({
    loc: `${host}`,
    lastmod: new Date().toISOString(),
  });

  const excluded_slugs = ["service-pages", "main-header", "main-footer"];

  const pattern = `(${excluded_slugs.join("|")})`;
  const excluded_regexp = new RegExp(pattern, "ig");

  allStories?.stories?.map((el: ISbStoryData) => {
    excluded_regexp.lastIndex = 0;
    const match = excluded_regexp.test(el.full_slug);
    if (!match) {
      result.push({
        loc: `${host}/${el.full_slug}`,
        lastmod: new Date().toISOString(),
        // changefreq
        // priority
      });
    }
  });

  return getServerSideSitemap(result, {
    "Cache-Control": "max-age=0",
    "CDN-Cache-Control": "max-age=0",
    "Netlify-CDN-Cache-Control": "max-age=0",
  });
}
