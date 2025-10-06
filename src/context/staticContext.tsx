import { createContext } from "react";

export const DEFAULT_STATIC_CONTEXT = {
  edgeGeoFetched: false,
  country: "",
  currency: "",
  // gtm: {},
};

export const StaticContext = createContext(DEFAULT_STATIC_CONTEXT);
