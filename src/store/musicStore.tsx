import { create } from "zustand";
import { persist } from "zustand/middleware";

// TODO: Add previousID to Music Store to look if the previousID match with the currentID

export const useMusicStore = create(
  persist(
    (set) => ({
      isPlaying: false,
      isPlayingBar: false,
      songlink: false,
      currentTime: 0,
      previousID: 0,
      writing: false,
      currentMusic: {},
      searching: false,
      volume: 1.0,
      setVolume: (volume: number) => set({ volume }),
      setWriting: (writing: boolean) => set({ writing }),
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      setIsPlayingBar: (isPlayingBar: boolean) => set({ isPlayingBar }),
      setCurrentMusic: (currentMusic: unknown) => set({ currentMusic }),
      setSongLink: (songlink: boolean) => set({ songlink }),
      setCurrentTime: (currentTime: number) => set({ currentTime }),
      setPreviousID: (previousID: number) => set({ previousID }),
      setSearching: (searching: boolean) => set({ searching }),
    }),
    {
      // ...
      name: "music-storage",
      version: 1,
    }
  )
);

export const musicStore = useMusicStore;
