import { create } from "zustand";
import { persist } from "zustand/middleware";

// TODO: Add previousID to Music Store to look if the previousID match with the currentID
interface CurrentMusic {
  song?: Blob | undefined;
  title: string;
  artist: string;
  id?: number | undefined;
  preview_image: string;
}

export interface Search {
  id: number;
  title: string;
  artist: string;
  duration: number;
  kind: string;
  artwork: string;
  endpoint: string;
}

export interface MusicStore {
  isPlaying: boolean;
  currentTime: number;
  previousID: number;
  writing: boolean;
  currentMusic: CurrentMusic;
  searching: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  setWriting: (writing: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  getIsPlaying: () => boolean;
  setCurrentMusic: (currentMusic: CurrentMusic) => void;
  setCurrentTime: (currentTime: number) => void;
  setPreviousID: (previousID: number) => void;
  setSearching: (searching: boolean) => void;
}

export const useMusicStore = create<MusicStore, [["zustand/persist", unknown]]>(
  persist<MusicStore>(
    (set, get) => ({
      isPlaying: false,
      currentTime: 0,
      previousID: 0,
      writing: false,
      currentMusic: {
        id: undefined,
        song: undefined,
        title: "",
        artist: "",
        preview_image: "",
      },
      searching: false,
      volume: 1.0,
      setVolume: (volume: number) => set({ volume }),
      setWriting: (writing: boolean) => set({ writing }),
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
      getIsPlaying: () => {
        return get().isPlaying;
      },
      setCurrentMusic: (currentMusic: CurrentMusic) => set({ currentMusic }),
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
