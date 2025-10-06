import "server-only";

import { ISbStoryData, ISbLinkURLObject, ISbStoriesParams } from "storyblok-js-client";
import { IGenericObject } from "@/types/generic";
import { getPublishedSlugsQuery } from "./storyblokQueries";
import {
  buildResolveRelationsString,
  mergeRelatedStoriesInModules,
} from "./storyblokResponseUtils";

/* START                               */
/* do NOT modify this by hand!         */
/* this code is altered automatically  */
/* by the build script.                */
const isProd = false;
/* END                                 */

// ref. https://github.com/storyblok/storyblok-js/blob/db3966d97577aa56b9469378b741655d38eb55c0/lib/modules/editable.ts
// this is to avoid inclusion by storyblok-react that uses client utils
export { storyblokEditable as wrappedStoryblokEditable } from "@storyblok/js";

export interface ISbStoryResponse {
  story: ISbStoryData;
  rels: ISbStoryData[];
  links?: (ISbStoryData | ISbLinkURLObject)[];
}

interface ISbDataSourceValue {
  id: number;
  name: string;
  value: string;
  dimension_value: string | null;
}

export interface ISbDatasourceResponse {
  datasource_entries: Array<ISbDataSourceValue>;
}

export interface ILinks {
  links: { [key: string]: ILink };
  total: number;
  per_page: number;
}

export interface ILink extends ISbLinkURLObject {
  is_folder: boolean;
  parent_id: number | null;
  published: boolean;
  path: null;
  position: number;
  is_startpage: boolean;
  real_path: string;
}

export interface ISbStoriesResult {
  stories: ISbStoryData[];
  links?: (ISbStoryData | ISbLinkURLObject)[];
  cv?: number;
  rels?: ISbStoryData[];
  per_page: number;
  total: number;
}

export interface IGQLParams {
  query: string;
  version?: "draft" | "published";
}

// api reference https://www.storyblok.com/docs/api/content-delivery/v2
export async function getStory(
  slug: string,
  revalidation_time: number = 10
): Promise<ISbStoryResponse> {
  const version = isProd ? "published" : "draft";

  let url =
    process.env.STORYBLOK_BASE_URL +
    "/stories/" +
    slug +
    "?token=" +
    process.env.STORYBLOK_API_TOKEN +
    "&version=" +
    version +
    "&resolve_relations=" +
    buildResolveRelationsString() +
    `&resolve_links=url&cv=${Date.now()}`;

  console.log(url);

  const res = await fetch(url);

  let result = await res.json();

  result = mergeRelatedStoriesInModules(result);

  return result;
}

export async function getStories(
  params: ISbStoriesParams,
  withoutBody: boolean = false
): Promise<ISbStoriesResult> {
  params.page = params.page || 1;
  params.version = isProd ? "published" : "draft";

  const queryString = new URLSearchParams(params as any).toString();

  let url =
    process.env.STORYBLOK_BASE_URL +
    "/stories?token=" +
    process.env.STORYBLOK_API_TOKEN +
    `&per_page=100&cv=${Date.now()}` +
    "&" +
    queryString;

  const res = await fetch(url);
  const per_page: number = Number(res.headers.get("per-page"));
  let total: number = Number(res.headers.get("total"));

  let first_page_results = await res.json().then((result) => {
    if (withoutBody) {
      return {
        ...result,
        stories: result.stories.map((story: ISbStoryData) => {
          const { content } = story;
          const filteredContent = { ...content, body: [] };
          return { ...story, content: filteredContent };
        }),
      };
    }
    return result;
  });

  return {
    ...first_page_results,
    per_page,
    total,
  };
}

export async function getAllStories(
  params: ISbStoriesParams,
  withoutBody?: boolean
): Promise<ISbStoriesResult> {
  const first_page_results = await getStories(params, withoutBody);

  const per_page: number = Number(first_page_results.per_page);
  let total: number = Number(first_page_results.total);

  const pages_needed: number = Math.ceil(total / per_page);

  if (pages_needed > 1) {
    const promises = [];

    // Loop through the range from 2 to the number of pages needed (both inclusive).
    for (let index = 2; index <= pages_needed; index++) {
      const tmp_params = { ...params, ...{ page: index } };
      // same params but overwrite the page with new page
      promises.push(getStories(tmp_params));
    }

    let promises_results = await Promise.all(promises);

    // Reduce the promises_results array into a single object (merged_results).
    // The reducer function merges the links property of the current item into the accumulator's links property.
    // Initial value of the accumulator is an object with an empty links property, total, and per_page.

    let merged_results: any = promises_results.reduce(
      (accumulator, current) => {
        accumulator.stories = [...accumulator.stories, ...current.stories];
        accumulator.links = [
          ...(accumulator.links as Array<any>),
          ...(current.links as Array<any>),
        ];
        accumulator.rels = [...(accumulator.rels as Array<any>), ...(current.rels as Array<any>)];

        return accumulator;
      },
      { stories: [], links: [], rels: [], total, per_page }
    );

    // Merge the links property of the first_page object into the links property of the merged_results object.
    merged_results.stories = [...first_page_results.stories, ...merged_results.stories];
    merged_results.links = [
      ...(first_page_results.links as Array<any>),
      ...(merged_results.links as Array<any>),
    ];
    merged_results.rels = [
      ...(first_page_results.rels as Array<any>),
      ...(merged_results.rels as Array<any>),
    ];

    return merged_results;
  }

  return first_page_results;
}

/**
 * For some reason I suppose vercel is caching this API only,
 * i add a random timestamp for each slug so that the cache is manually invalidated because the url looks different everytime
 */
export async function getDataSource(
  slug: string,
  language: string
): Promise<ISbDatasourceResponse> {
  let url =
    process.env.STORYBLOK_BASE_URL +
    "/datasource_entries?datasource=" +
    slug +
    "&token=" +
    process.env.STORYBLOK_API_TOKEN +
    "&dimension=" +
    language +
    `&per_page=200&page=1&cv=${Date.now()}`;

  const res = await fetch(url);
  const result = await res.json();

  return result;
}

export async function getPublishedSlugs(language: string = ""): Promise<IGenericObject> {
  const url = process.env.STORYBLOK_GRAPHQL_URL!;
  const version = isProd ? "published" : "draft";
  const requestHeaders: HeadersInit = new Headers();

  requestHeaders.set("Token", process.env.STORYBLOK_API_TOKEN!);
  requestHeaders.set("version", version);

  /**
   * we dont want service pages to be considered as equal as other contents,
   * they do not appear in sitemap
   */
  const excluded_slugs = ["it/service-pages/*", "en/service-pages/*"];
  const query: string = getPublishedSlugsQuery(language, excluded_slugs);

  const res = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ query }),
  });

  return res.json() as Promise<object>;
}

export async function executeGQL({
  query,
  version = "published",
}: IGQLParams): Promise<IGenericObject> {
  const url = process.env.STORYBLOK_GRAPHQL_URL!;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Token", process.env.STORYBLOK_API_TOKEN!);
  requestHeaders.set("version", version);

  const res = await fetch(url, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ query }),
  });

  return res.json() as Promise<IGenericObject>;
}

export const convertDatasourceLabelsToDictionary = (
  data: ISbDatasourceResponse
): IGenericObject => {
  let result: IGenericObject = {};

  if (data["datasource_entries"] && data["datasource_entries"].length) {
    data["datasource_entries"].forEach((element) => {
      if (element) {
        const tmp = element.name.replace(".", "_");
        result[tmp] = element.dimension_value || element.value;
      }
    });
  }

  result = {
    labels: result,
  };
  return result;
};

// api reference https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/links/links

export async function getLinks(
  page: number = 1,
  fetch_all_pages: boolean = false
): Promise<ILinks> {
  let url =
    process.env.STORYBLOK_BASE_URL +
    "/links" +
    "?paginated=1&token=" +
    process.env.STORYBLOK_API_TOKEN +
    `&per_page=100&cv=${Date.now()}&page=` +
    page;

  const res = await fetch(url);

  const per_page: number = Number(res.headers.get("per-page"));
  let total: number = Number(res.headers.get("total"));

  const res_json = await res.json();
  const result = {
    links: res_json.links,
    total,
    per_page,
  };

  return result;
}

export async function getAllLinks(): Promise<ILinks> {
  const first_page = await getLinks();

  const per_page: number = first_page.per_page;
  const total: number = first_page.total;
  const pages_needed: number = Math.ceil(total / per_page);

  if (pages_needed > 1) {
    const promises = [];

    // Loop through the range from 2 to the number of pages needed (both inclusive).
    for (let index = 2; index <= pages_needed; index++) {
      promises.push(getLinks(index));
    }
    let promises_results = await Promise.all(promises);

    // Reduce the promises_results array into a single object (merged_results).
    // The reducer function merges the links property of the current item into the accumulator's links property.
    // Initial value of the accumulator is an object with an empty links property, total, and per_page.

    let merged_results: ILinks = promises_results.reduce(
      (accumulator, current) => {
        accumulator.links = { ...accumulator.links, ...current.links };
        return accumulator;
      },
      { links: {}, total, per_page }
    );

    // Merge the links property of the first_page object into the links property of the merged_results object.
    merged_results.links = { ...merged_results.links, ...first_page.links };

    return merged_results;
  }

  return first_page;
}

export function isDev(): boolean {
  return !isProd
}

export async function getLocales(): Promise<string[]> {
  // only goes 1 level deep, so it remains scalable
  const stories = await getAllStories({ is_startpage: true, level: 1 }, true);
  let locales: string[] = [];

  if (!!stories.stories.length) {
    const items = stories.stories;

    items.forEach((i: { full_slug: string }) => {
      const locale = i.full_slug.split("/")[0];

      if (!locales.includes(locale)) {
        locales.push(locale);
      }
    });
  }

  return locales;
}
