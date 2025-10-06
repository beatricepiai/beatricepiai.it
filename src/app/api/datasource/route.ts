import { getDataSource } from "@/lib/storyblokUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  let LABEL_DATASOURCE: string =
    request.nextUrl.searchParams.get("label") || "";
  let LANG_DATASOURCE: string =
    request.nextUrl.searchParams.get("lang") || "en";

  const labels = await getDataSource(LABEL_DATASOURCE, LANG_DATASOURCE);
  return NextResponse.json(labels, {
    headers: {
      // "Cache-Control": "max-age=300",
      // "CDN-Cache-Control": "max-age=300",
      // "Vercel-CDN-Cache-Control": "max-age=300",
    },
  });
}
