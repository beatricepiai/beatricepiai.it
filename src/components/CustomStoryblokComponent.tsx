"use client";

import { FunctionComponent } from "react";
import { ISbLinkURLObject, ISbStoryData } from "storyblok-js-client";
import { storyblokEditable } from "@storyblok/js";
import { getComponent } from "@/lib/componentsMap";
import { SbBlokData } from "@storyblok/js";
import { GTMEvent } from "@/types/generic";

export interface CustomStoryblokComponentProps {
  blok: SbBlokData;
  links?: (ISbStoryData | ISbLinkURLObject)[];
  variant?: string;
  priority?: boolean;
  gtmEvent?: GTMEvent;
  [key: string]: any;
}

interface genericProps {
  [key: string]: any; // 'unknown' forces type assertion
}

export const CustomStoryblokComponent: FunctionComponent<
  CustomStoryblokComponentProps & genericProps
> = ({ blok, links = [], gtmEvent, ...restProps }) => {
  if (!blok) {
    return <div>Please provide a blok property to the StoryblokComponent</div>;
  }

  if (blok.component) {
    const Component = getComponent(blok.component);
    if (Component) {
      return (
        <div {...storyblokEditable(blok)}>
          <Component
            blok={blok}
            links={links}
            {...restProps}

            gtmEvent={gtmEvent}
          />
        </div>
      );
    }
  }
  return <></>;
};
