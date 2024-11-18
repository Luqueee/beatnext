"use client";

import type { Playlist } from "@/models/playlistSchema";
import { useMusicStore, useSongBarStore } from "@/store";
import { MusicIcon } from "lucide-react";
import { toogleVisibilityPlaylist } from "@/db/playlist";
import Image from "next/image";
import { useState } from "react";
export default function SongsPlaylist({
  playlist,
  id,
  profile = true,
}: {
  playlist: Playlist;
  id: string;
  profile?: boolean;
}) {
  const { generateTracks, setContext } = useMusicStore();
  const { setPlaying } = useSongBarStore();
  const [isVisible, setIsVisible] = useState(playlist.visible);
  const handlePlay = (index = 0) => {
    generateTracks(playlist.songs, index);
    setContext("playlist");
    setPlaying(true);
  };

  const handleVisibility = () => {
    toogleVisibilityPlaylist({
      id,
    }).then(() => {
      setIsVisible(!isVisible);
    });
  };

  return (
    <div className=" flex flex-col gap-8 pb-8">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handlePlay()}
          className=" w-fit border border-white px-4 py-2 rounded-lg"
        >
          Play
        </button>
        {profile && (
          <div className=" gap-4 items-center flex">
            <button
              type="button"
              onClick={handleVisibility}
              className=" w-fit border border-white px-4 py-2 rounded-lg"
            >
              Toogle Visible
            </button>
            <span>{isVisible ? "Visible" : "Hidden"}</span>
          </div>
        )}
      </div>
      {playlist.songs.map((song, index) => (
        <button
          type="button"
          onClick={() => handlePlay(index)}
          key={song.id}
          className="grid grid-cols-[auto_1fr] gap-4 "
        >
          <Image
            src={song.cover}
            alt={song.title}
            width={70}
            height={70}
            className="rounded-md "
          />
          <div className="flex flex-col justify-center">
            <h4 className="w-fit text-start text-xl">{song.title}</h4>
            <p>
              <span className="line-clamp-1 w-fit text-start flex gap-2">
                <span>
                  <MusicIcon />
                </span>
                {song.artist}
              </span>
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
