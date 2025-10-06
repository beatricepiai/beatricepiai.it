import { ISbStoryData, ISbLinkURLObject } from "storyblok-js-client";

export interface GenericBlockProps<T> {
  blok: T;
  links?: (ISbStoryData | ISbLinkURLObject)[];
  [key: string]: any;
}

export type Palette = "white" | "black";

export type Asset = {
  filename: string;
  alt: string;
  _uid: string;
  id: number;
  title: string;
  focus?: string;
};

export interface LinkItem {
  id: string;
  url: string;
  linktype: "story" | "url";
  cached_url: string;
}

export interface IGenericObject {
  [key: string]: any;
}

export interface ISbTableItem {
  component: string;
  _uid: string;
  value: string;
}

export interface ISbTableBodyItem {
  component: string;
  _uid: string;
  body: ISbTableItem[];
}

export interface ISbTable {
  fieldtype: "table";
  thead: ISbTableItem[];
  tbody: ISbTableBodyItem[];
}

export interface GTMEvent {
  [key: string]: string;
}
