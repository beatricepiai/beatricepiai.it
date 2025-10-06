"use client";

/**
 *
 * WARNING
 * this route contains logic specific to a previous project.
 * It is present only for reference.
 *
 * **/

import { CustomStoryblokComponent } from "@/components/CustomStoryblokComponent";
import { GenericBlockProps } from "@/types/generic";
import { ContextProvider } from "@/context/ctx";
import { StaticContext, DEFAULT_STATIC_CONTEXT } from "@/context/staticContext";
import React, { useState } from "react";
// import { useLabelsStore } from "@/stores/LabelsStore";

export default function Page({ blok, links }: GenericBlockProps<any>) {
  const [contextData] = useState(DEFAULT_STATIC_CONTEXT);
  // const labelsStore = useLabelsStore();

  return (
    <>
      <StaticContext.Provider value={contextData}>
        <ContextProvider>
          {/* Testing translatable label: {t("speaker")} */}
          {/* {labelsStore.labels['speaker']} */}
          <div>
            {blok.body?.map((blok: any) => {
              return (
                <div key={blok._uid} className="module" data-module>
                  <CustomStoryblokComponent
                    blok={blok}
                    links={links}
                  />
                </div>
              );
            })}
          </div>
        </ContextProvider>
      </StaticContext.Provider>
    </>
  );
}
