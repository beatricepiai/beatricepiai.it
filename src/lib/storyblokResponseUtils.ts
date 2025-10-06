import { IGenericObject } from "@/types/generic";
import { ISbStoryResponse } from "./storyblokUtils";

// to use for modules that need access to storyblok related story extra/full data
const MODULES_WITH_RELATIONS: IGenericObject = {
  // example: name : field
  // CardWide: ["product_ref"],
  // TechSpecs: ["product"],
};

export function buildResolveRelationsString(): string {
  let relationsArr = [];

  // iterate over each key-value pair in RELATIONS
  for (const [key, values] of Object.entries(MODULES_WITH_RELATIONS)) {
    // for each value in the array, create a string [key].[value] and add it to the array
    let keyRelations = values.map((value: string) => `${key}.${value}`);
    relationsArr.push(...keyRelations);
  }

  // join all the strings in the array with the ',' character
  let res = relationsArr.join(",");

  return res;
}

export type TMergingStrategy = "FULL_STORY" | "PRODUCT_PROPS";

export function mergeRelatedStoriesInModules(
  storyResponse: ISbStoryResponse,
  mergingStrategy: TMergingStrategy = "FULL_STORY"
): ISbStoryResponse {
  const replaceFieldWithRelatedStory = (module: IGenericObject) => {
    if (!module) return;

    const fields: Array<string> | undefined = MODULES_WITH_RELATIONS[module.component];

    // if the module has a component that is in the MODULES_WITH_RELATIONS object, replace the field with the related story
    if (fields !== undefined) {
      fields?.map((fieldname: string) => {
        module[fieldname] = Array.isArray(module[fieldname])
          ? module[fieldname]
          : [module[fieldname]];

        module[fieldname] = module[fieldname]?.map((uuid: string) => {
          const replacement = storyResponse.rels.find((replacement) => replacement.uuid === uuid);
          if (!replacement) {
            console.log('Ignoring story with uuid "' + uuid + '" since it has not been published');
          }
          return replacement;
        });
      });
    }

    // recursively call this function on each sub-module (if there's an array, check it, otherwise do nothing)
    Object.keys(module).forEach((key) => {
      if (Array.isArray(module[key])) {
        module[key].forEach((subModule: IGenericObject) => {
          replaceFieldWithRelatedStory(subModule);
        });
      }
    });
  };

  if (storyResponse.rels === undefined || storyResponse.rels?.length === 0) {
    return storyResponse;
  }

  storyResponse.story.content.body.map((module: IGenericObject) => {
    replaceFieldWithRelatedStory(module);
  });

  return storyResponse;
}
