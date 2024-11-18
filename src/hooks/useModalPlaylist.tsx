"use client";
import type { Song } from "@/models/playlistSchema";
import { useModalStore } from "@/store";

const useModalPlaylist = (song: Song | null) => {
  const { setCurrentSongPlaylist, setOpenModalPlaylist } = useModalStore();

  const handleOpenModalPlaylist = () => {
    if (song) {
      setCurrentSongPlaylist(song);
      setOpenModalPlaylist(true);
    }
  };

  return {
    handleOpenModalPlaylist,
  };
};

export default useModalPlaylist;
