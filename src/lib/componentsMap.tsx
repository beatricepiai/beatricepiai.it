import { ComponentType, FunctionComponent } from "react";

import Page from "@/components/layout/Page";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TextBlock from "@/components/organisms/TextBlock";

export interface ComponentsMapType {
  [key: string]: ComponentType<any>;
}

export const componentsMap: ComponentsMapType = {
  //---- Components ----//
  TextBlock: TextBlock,

  //---- Layout ----//
  page: Page,
  "main-header": Header,
  "main-footer": Footer,
};

export const getComponent = (componentName: string): ComponentType<any> => {
  if (componentsMap[componentName] === undefined) {
    console.error(`Component ${componentName} not found in componentsMap.`);
    const ErrorComponent: FunctionComponent = () => <></>;
    return ErrorComponent;
  }

  return componentsMap[componentName];
};
