import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/* START                               */
/* do NOT modify this by hand!         */
/* this code is altered automatically  */
/* by the build script.                */
const isProd = false;
/* END                                 */

export async function POST(request: NextRequest) {
  try {
    const request_data = await request.json();
    const full_slug = request_data["full_slug"];
    const path = full_slug.endsWith('/') ? '/' + full_slug.slice(0, -1) : '/' + full_slug;

    revalidatePath(path);

    return NextResponse.json({ revalidated: true, now: Date.now(), path: path });
  }
  catch (e) {
    console.error(e);
    return NextResponse.json({ revalidated: false, now: Date.now() });
  }
}
