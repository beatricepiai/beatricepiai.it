import { createContext, useEffect, useState } from "react";

const Context = createContext({
  isMobile: false,
  isTablet: false,
  windowWidth: 0,
  windowHeight: 0,
});

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const mobileViewport = 799;
  const tabletViewport = 1024;

  useEffect(() => {
    const updateMedia = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      if (window.innerWidth <= mobileViewport) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }

      if (window.innerWidth <= tabletViewport && window.innerWidth > mobileViewport) {
        setIsTablet(true);
      } else {
        setIsTablet(false);
      }
    };

    updateMedia();

    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  return (
    <Context.Provider
      value={{
        isMobile,
        isTablet,
        windowWidth,
        windowHeight,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
