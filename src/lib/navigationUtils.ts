import { getStory, getDataSource, ISbDatasourceResponse } from "./storyblokUtils";

/**
 * Checks if a given string matches any of a set of regular expressions.
 *
 * @param {string} slug - The string to be checked.
 * @returns {boolean} Returns true if the slug matches any of the provided regular expressions, false otherwise.
 */
export const isServicePage = (slug: string): boolean => {
  const regexps = [/service\-pages/i];

  return regexps.some((regexp) => regexp.test(slug));
};

const MAIN_HEADER_SLUG = "main-header";
const MAIN_FOOTER_SLUG = "main-footer";
const LABELS_DATASOURCE = ["not-found-page", "labels"];

export async function prefetchLayoutData(language: string) {
  let headerPath = MAIN_HEADER_SLUG;
  let footerPath = MAIN_FOOTER_SLUG;

  if (language != "") {
    headerPath = language + "/" + headerPath;
    footerPath = language + "/" + footerPath;
  }

  const headerData = getStory(headerPath);
  const footerData = getStory(footerPath);
  const i18nLabelsData: ISbDatasourceResponse = { datasource_entries: [] };
  const labelsPromises = LABELS_DATASOURCE.map((label) => getDataSource(label, language ?? "en"));

  await Promise.all(labelsPromises).then((results) => {
    // results will be an array of responses from each getDataSource call
    results.forEach((res) => {
      if (Array.isArray(res.datasource_entries)) {
        i18nLabelsData.datasource_entries.push(...res.datasource_entries);
      }
    });
  });

  const [headerStory, footerStory, i18nLabels] = await Promise.all([
    headerData,
    footerData,
    i18nLabelsData,
  ]);

  return {
    headerStory,
    footerStory,
    i18nLabels,
  };
}
