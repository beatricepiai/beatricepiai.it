"use client";

import { loadStoryblokBridge } from "@storyblok/js";

import { useState } from "react";

import {
  CustomStoryblokComponent,
  CustomStoryblokComponentProps,
} from "./CustomStoryblokComponent";

interface CustomStoryblokBridgeSpecificProps {
  relations?: string;
}

// https://www.storyblok.com/faq/how-to-verify-the-preview-query-parameters-of-the-visual-editor#nodejs
const CustomStoryblokBridge = ({
  blok,
  links = [],
  relations = "",
  ...restProps
}: CustomStoryblokComponentProps & CustomStoryblokBridgeSpecificProps) => {
  const [blokState, setBlokState] = useState(blok);
  const relations_array = relations.split(",");

  loadStoryblokBridge()
    .then(() => {
      const { StoryblokBridge, location } = window;
      const storyblokInstance = new StoryblokBridge({
        resolveRelations: relations_array,
      });
      storyblokInstance.on(["published", "change"], () => {
        location.reload();
      });
      storyblokInstance.on(["input"], (e) => {
        setBlokState(e?.story?.content);
      });
    })
    .catch((err) => console.error(err));

  return <CustomStoryblokComponent blok={blokState} links={links} {...restProps} />;
};

export default CustomStoryblokBridge;
