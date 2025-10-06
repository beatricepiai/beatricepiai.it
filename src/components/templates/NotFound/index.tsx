import BlocksLoop from "@/components/BlocksLoop";
import { getStory } from "@/lib/storyblokUtils";
import React from "react";

const NotFound = async () => {
  let fullSlug = "en/service-pages/404";
  let pageData: any = false;

  pageData = await getStory(fullSlug, 600);

  return (
    <div>
      NotFoundPage
      {pageData?.story && <BlocksLoop story={pageData.story} />}
    </div>
  );
};

export default NotFound;
