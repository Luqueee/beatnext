import { create } from "zustand";
import { persist } from "zustand/middleware";

// TODO: Add previousID to Music Store to look if the previousID match with the currentID
interface CurrentMusic {
  song: Blob;
  title: string;
  artist: string;
  id?: string;
  preview_image: string;
}

export interface Search {
  id: number;
  title: string;
  artist: string;
  duration: number;
  artwork: string;
  endpoint: string;
}

export interface MusicStore {
  isPlaying: boolean;
  isPlayingBar: boolean;
  songlink: boolean;
  currentTime: number;
  previousID: number;
  writing: boolean;
  currentMusic: CurrentMusic;
  searching: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  setWriting: (writing: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsPlayingBar: (isPlayingBar: boolean) => void;
  setCurrentMusic: (currentMusic: CurrentMusic) => CurrentMusic;
  setSongLink: (songlink: boolean) => void;
  setCurrentTime: (currentTime: number) => void;
  setPreviousID: (previousID: number) => void;
  setSearching: (searching: boolean) => void;
}

export const useMusicStore = create<MusicStore, [["zustand/persist", unknown]]>(
  persist<MusicStore>(
    (set) => ({
      isPlaying: false,
      isPlayingBar: false,
      songlink: false,
      currentTime: 0,
      previousID: 0,
      writing: false,
      currentMusic: {
        song: new Blob(),
        title: "",
        artist: "",
        preview_image: "",
      },
      searching: false,
      volume: 1.0,
      setVolume: (volume: number) => set({ volume }),
      setWriting: (writing: boolean) => set({ writing }),
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      setIsPlayingBar: (isPlayingBar: boolean) => set({ isPlayingBar }),
      setCurrentMusic: (currentMusic: CurrentMusic) => {
        set({ currentMusic });
        return currentMusic;
      },
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
