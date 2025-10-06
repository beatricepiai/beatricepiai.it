import { useContext } from "react";
import { ViewportContext } from "@/context/viewportContext";

export const useViewport = () => {
  const { width } = useContext(ViewportContext);

  return { width };
};
