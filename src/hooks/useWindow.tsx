"use client";
import { useEffect, useState } from "react";

const useWindow = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(0);
  useEffect(() => {
    const handleResize = () => {
      const screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

      setWidth(screenWidth);
      setIsDesktop(screenWidth >= 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isDesktop]);

  return {
    width,
    isDesktop,
  };
};

export default useWindow;
