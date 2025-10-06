import { createContext, useEffect, useState } from "react";

export const DEFAULT_VIEWPORT_CONTEXT = {
  width: 576,
};

export const ViewportContext = createContext(DEFAULT_VIEWPORT_CONTEXT);

export const ViewportProvider = ({ children }: { children: React.ReactNode }) => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return <ViewportContext.Provider value={{ width }}>{children}</ViewportContext.Provider>;
};
