"use client";

import type { getPlaylistById } from "@/db/playlists";
import { useMusicStore, useSongBarStore } from "@/store";

export default function PlayBlock({ playlist }: { playlist: getPlaylistById }) {
  const { generateTracks, setContext } = useMusicStore();
  const { setPlaying } = useSongBarStore();

  const handlePlay = (index = 0) => {
    console.log("songs", playlist.songs);
    generateTracks(playlist.songs, index);
    setContext("playlist");
    setPlaying(true);
  };
  return (
    <div>
      <button onClick={() => handlePlay()} type="button">
        Play
      </button>
    </div>
  );
}
