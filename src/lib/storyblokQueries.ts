export function QueryHeaderFooterLinks(language: string = ""): string {
  return `
{
    HeaderItems(by_slugs:  "${language}/main-header",resolve_links:"url") {
      items {
        uuid
        slug
        full_slug
        content {
        }
      }
    }
    FooterItems(by_slugs: "${language}/main-footer",resolve_links:"url") {
      items {
        uuid
        slug
        content {
        }
      }
    }
  }
`;
}

export function getPublishedSlugsQuery(
  language: string = "",
  excluded_slugs: Array<string> = []
): string {
  const excluded_slugs_string = excluded_slugs.length == 0 ? "" : excluded_slugs.join(",");
  const starts_with = language.length ? `${language}` : "";

  return `
    {
      PageItems (starts_with:"${starts_with}", excluding_slugs: "${excluded_slugs_string}"){
        items {
          full_slug
        }
      }
    }
  `;
}
