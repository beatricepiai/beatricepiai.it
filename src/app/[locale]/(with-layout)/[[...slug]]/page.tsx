import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isServicePage } from "@/lib/navigationUtils";
import { getStory, getPublishedSlugs } from "@/lib/storyblokUtils";
import { IGenericObject } from "@/types/generic";
import BlocksLoop from "@/components/BlocksLoop";

/* START                               */
/* do NOT modify this by hand!         */
/* this code is altered automatically  */
/* by the build script.                */
const isProd = false;
export const revalidate = 0;
/* END                                 */

type PageProps = {
  params: {
    locale: string;
    slug: Array<string>;
  };
};

const generateFullSlug = (props: PageProps): string => {
  let fullSlug: string;

  fullSlug = props.params.locale + "/" + (props.params.slug ? props.params.slug?.join("/") : "");

  return fullSlug;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const fullSlug = generateFullSlug(props);
  const pageData = await getStory(fullSlug);
  const alternates: any = {};

  pageData.story?.alternates?.map((a) => {
    const lang = a.full_slug.split("/")[0] || "";
    if (!!lang.length) alternates[lang] = "/" + a.full_slug;
  });

  const host = process.env.DOMAIN_URL

  if (!host) {
    throw new Error("DOMAIN_URL must be set in .env")
  }

  const metatags = pageData.story?.content.SEO;
  if (pageData.story && metatags && metatags.title?.trim()) {
    return {
      metadataBase: new URL(host),
      alternates: {
        canonical: "./",
        languages: alternates,
      },
      title: metatags.title,
      description: metatags.description,
      openGraph: {
        title: metatags.og_title,
        description: metatags.og_description,
        images: metatags.og_image,
      },
      twitter: {
        card: "summary_large_image",
        title: !!metatags.twitter_title.trim() ? metatags.twitter_title : metatags.title,
        description: !!metatags.twitter_description.trim()
          ? metatags.twitter_description
          : metatags.description,
        images: [!!metatags.twitter_image.trim() ? metatags.twitter_image : metatags.og_image],
      },
    };
  }

  const title = pageData.story?.name ?? "Not found";

  const pageExists = pageData.story?.name
    ? {
      metadataBase: new URL(host),
      alternates: {
        canonical: "./",
        languages: alternates,
      },
    }
    : {};
  return {
    title: title,
    ...pageExists,
  };
}

export async function generateStaticParams() {
  const pages: IGenericObject = await getPublishedSlugs();

  var items: any = [];

  let res: { locale: string; slug: string[] }[] = [];

  if (pages && pages.data) {
    Object.keys(pages?.data)?.map((element) => {
      items.push(...pages.data[element].items);
    });

    res = items.map((item: IGenericObject) => {
      const locale = item.full_slug.split("/")[0];
      const slug = item.full_slug.split("/").slice(1);

      return {
        locale,
        slug,
      };
    });
  }

  return res;
}

export default async function Page(props: PageProps) {
  const fullSlug = generateFullSlug(props);

  let pageData: any;

  if (isProd && isServicePage(fullSlug)) {
    notFound();
  }

  if (fullSlug != "service-worker.js") {
    pageData = await getStory(fullSlug);

    if (!pageData.story) {
      notFound();
    }
  }

  return <>{pageData?.story && <BlocksLoop story={pageData.story} links={pageData.links} />}</>;
}
