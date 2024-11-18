"use client";
import { extractColors } from "extract-colors";
import type { FinalColor } from "extract-colors/lib/types/Color";

import { useEffect, useState } from "react";
export default function BgBlock({
  cover,
  children,
  position = 5,
  opacity = 0.5,
  className,
}: {
  cover: string | undefined;
  children: React.ReactNode;
  position?: number;
  opacity?: number;
  className?: string;
}) {
  const [bg, setBg] = useState<string>("#000000");

  useEffect(() => {
    if (cover)
      extractColors(cover)
        .then((color: FinalColor[]) => {
          const color_choose = `rgba(${color[position].red},${color[position].green}, ${color[position].blue}, ${opacity})`;

          setBg(color_choose);
        })
        .catch(console.error);
  }, [cover]);

  return (
    <div
      className={`transition duration-500 flex flex-col gap-4 rounded-lg ${className} `}
      style={{
        backgroundColor: bg,
      }}
    >
      {children}
    </div>
  );
}
