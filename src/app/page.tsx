import { redirect } from "next/navigation";

/* START                               */
/* do NOT modify this by hand!         */
/* this code is altered automatically  */
/* by the build script.                */
export const revalidate = 0;
/* END                                 */

/**
 * This controller only redirects to the default language.
 */
export default function Page() {
    redirect("/en");
}
