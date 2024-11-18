"use client";

import type { session } from "@/auth";
import { Spotify } from "@/lib/spotify";
import { useProfileStore } from "@/store";
import { useCallback, useEffect } from "react";

const useStats = (session: session) => {
  const { statsSongs, setStatsSongs, getStatsSongs } = useProfileStore();

  const fetchTracks = useCallback(async () => {
    const data = await Spotify.getTopTracks("tracks", session);
    setStatsSongs(data);
  }, []);

  useEffect(() => {
    const songs = getStatsSongs();
    console.log("useStats", songs);
    if (songs?.length === 0) {
      fetchTracks();
    }
  }, []);
  return { statsSongs, setStatsSongs };
};

export default useStats;
