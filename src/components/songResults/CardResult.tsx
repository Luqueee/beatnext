"use client";
import useWindow from "@/hooks/useWindow";
import { downloadSong } from "@/lib/soundcloud/client";
import { cn } from "@/lib/utils";
import { formatTimeWithMilliseconds } from "@/utils/formatTime";
import { Download, MusicIcon, Play } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { CreateFavAction } from "@/actions";
import type { Session } from "next-auth";
import { useState } from "react";
import DropDownSong from "../dropdowns/DropDownSong";
import { deleteFav } from "@/db/fav";
import type { Playlist, Song } from "@/models/playlistSchema";

const fallback =
  "https://i1.sndcdn.com/artworks-qwo8cKdL9gcOYTSC-k1OS3Q-large.jpg";

interface CardResultTypes {
  fetchSong: (
    artwork: string,
    id: number,
    title: string,
    artist: string
  ) => void;
  song_data: SoundCloud.Search;
  session?: Session | null;
  isFavSong: boolean;
  playlists: Playlist[];
}

export default function CardResult({
  fetchSong,
  song_data,
  session,
  isFavSong,
  ...props
}: CardResultTypes) {
  const { isDesktop } = useWindow();

  const [isFav, setIsFav] = useState<boolean>(isFavSong);
  const { id, artwork, title, artist, duration, kind } = song_data;

  const song: Song = {
    id: id,
    title: title,
    cover: artwork,
    artist: artist,
  };
  const { execute } = useAction(CreateFavAction, {
    onSuccess: ({ data, input }) => {
      console.log("Fav song created", data, input);
      setIsFav(true);
    },
  });

  //   useEffect(() => {
  //     getFav(id, session?.user?.name ?? "").then((res) => {
  //       console.log("checking fav... ", id, session?.user?.name, res);
  //     });
  //   }, []);

  const handleFavSong = (
    id: number,
    title: string,
    cover: string,
    artist: string
  ) => {
    if (session) {
      if (isFav && session?.user?.name) {
        console.log("removing fav...");
        deleteFav(id, session?.user?.name).then((res) => {
          console.log("fav deleted", res);
          setIsFav(false);
        });
      } else {
        execute({
          id,
          username: session?.user?.name ?? "",
          title,
          cover,
          artist,
        });
      }
    }
  };

  return (
    <div {...props} className=" grid grid-cols-[1fr_auto] items-center">
      <button
        type="button"
        onClick={() => fetchSong(artwork, id, title, artist)}
        className={cn(
          "flex flex-row outline-none ring-0 z-10 items-center justify-between gap-2 group",
          "hover:opacity-60 transition-opacity duration-200 max-w-[100%]"
        )}
      >
        <div className="grid grid-cols-[auto_1fr]  gap-4 ">
          <div className="relative min-w-16">
            <Image
              src={artwork ?? fallback}
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

          <div className="flex flex-col gap-2 justify-center overflow-hidden items-start my-auto">
            <p className="w-fit text-start line-clamp-1 truncate">{title}</p>
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
      </button>
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

            <DropDownSong
              isFav={isFav}
              handleFavSong={handleFavSong}
              song={song}
            />
          </>
        )}
      </div>
    </div>
  );
}
