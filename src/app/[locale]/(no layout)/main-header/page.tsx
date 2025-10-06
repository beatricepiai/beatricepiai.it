import { getStory } from "@/lib/storyblokUtils";
import BlocksLoop from "@/components/BlocksLoop";

/* START                               */
/* do NOT modify this by hand!         */
/* this code is altered automatically  */
/* by the build script.                */
export const revalidate = 0;
/* END                                 */

export const generateStaticParams = async () => {
    return [{ locale: "en" }, { locale: "it" }];
};

export default async function Page({
    params,
}: {
    params: { locale: string; slug: Array<string> };
}) {
    let fullSlug = `${params.locale}/main-header`;

    let pageData: any = false;

    pageData = await getStory(fullSlug);
    return <>{pageData?.story && <BlocksLoop story={pageData.story} links={pageData.links} />}</>;
}
