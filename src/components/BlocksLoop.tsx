import "server-only";

import { ISbStoryData, ISbLinkURLObject } from "storyblok-js-client";
import CustomStoryblokBridge from "./CustomStoryblokBridge";
import { CustomStoryblokComponent } from "./CustomStoryblokComponent";
import { buildResolveRelationsString } from "@/lib/storyblokResponseUtils";

// styles
import styles from "./index.module.scss";
import classNames from "classnames/bind";

const cn = classNames.bind(styles);

/* START                               */
/* do NOT modify this by hand!         */
/* this code is altered automatically  */
/* by the build script.                */
const isProd = false;
/* END                                 */

type BlocksLoopProps = {
  story: ISbStoryData;
  links?: ISbLinkURLObject[];
};

export default function BlocksLoop({ story, links = [] }: BlocksLoopProps) {
  const CLIENT_MODE = !isProd;

  return (
    <div className={cn("blocks")}>
      {CLIENT_MODE && (
        <CustomStoryblokBridge
          blok={story.content}
          links={links}
          relations={buildResolveRelationsString()}
        />
      )}

      {!CLIENT_MODE && (
        <CustomStoryblokComponent blok={story.content} links={links} />
      )}
    </div>
  );
}
