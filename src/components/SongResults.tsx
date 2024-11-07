"use client";
import { useMusicStore } from "@/store/musicStore";
import { formatTimeWithMilliseconds } from "@/utils/formatTime";
import { MusicIcon } from "./icons";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { downloadSong } from "@/lib/soundcloud/client";
import { Play, Download } from "lucide-react";
import useWindow from "@/hooks/useWindow";
import { cn } from "@/lib/utils";

export default function SongResults() {
  const { setCurrentMusic, setCurrentTime, songResults } = useMusicStore(
    (state) => state
  );

  useEffect(() => {
    console.log("results: ", songResults);
  }, [songResults]);

  const { isDesktop } = useWindow();

  const fetchSong = useCallback(
    (artwork_url: string, id: number, title: string, artist: string) => {
      setCurrentMusic({ preview_image: artwork_url, id, title, artist });
      setCurrentTime(0);
    },
    [setCurrentMusic, setCurrentTime]
  );

  // Trigger search fetch on debounced input change

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4 px-2">
        {songResults.map(({ id, artwork, kind, duration, artist, title }) => (
          <button
            type="button"
            onClick={() => fetchSong(artwork, id, title, artist)}
            key={id}
            className={cn(
              "flex flex-row outline-none ring-0 z-10 items-center justify-between gap-2 group",
              "hover:opacity-60 transition-opacity duration-200"
            )}
          >
            <div className="flex gap-4 w-full items-center ">
              <div className="relative">
                <Image
                  src={artwork ?? ""}
                  alt="album cover"
                  width={100}
                  height={100}
                  unoptimized
                  draggable={false}
                  className={cn(
                    kind === "playlist" ? "rounded-md" : "rounded-md",

                    isDesktop
                      ? "md:lg:w-20 group-hover:scale-90 transition-all duration-300"
                      : "w-16"
                  )}
                />
                <p
                  className={cn(
                    " absolute top-0 bg-zinc-900 rounded-md w-full h-full flex items-center justify-center",
                    " bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-200"
                  )}
                >
                  <Play
                    fill="white"
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-all duration-500"
                    )}
                  />
                </p>
              </div>

              <div className="flex flex-col gap-2 justify-center items-start my-auto">
                <p className="w-fit text-start line-clamp-1">{title}</p>
                <p className="flex items-center justify-start w-full gap-2">
                  <span>{kind === "track" && <MusicIcon />}</span>
                  <span className="line-clamp-1 w-fit text-start">
                    {artist}
                    {isDesktop && (
                      <span> - {formatTimeWithMilliseconds(duration)}</span>
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 h-14">
              {kind === "track" && (
                <>
                  {isDesktop && (
                    <button
                      type="button"
                      onClick={() => fetchSong(artwork, id, title, artist)}
                      className="border-2 w-10 z-20 h-10 aspect-square flex items-center justify-center border-white rounded-full p-2"
                    >
                      <Play fill="white" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => downloadSong(id, title)}
                    className="border-2 w-10 z-20 h-10 aspect-square flex items-center justify-center border-white rounded-full p-2"
                  >
                    <Download />
                  </button>
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
