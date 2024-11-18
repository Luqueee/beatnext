import type { Song } from "@/models/playlistSchema";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type context = "playlist" | "album" | "single" | "search" | "queue" | "";
interface MusicStoreState {
  tracks: Song[];
  currentIndex: number;
  context: context;
  hydrated?: boolean;
}

interface MusicStoreActions {
  setTracks: (tracks: Song[]) => void;
  pushTrack: (track: Song) => void;
  removeTrack: (index: number) => void;
  setCurrentIndex: (index: number) => void;
  setContext: (context: context) => void;
  setHydrated: () => void;
  jumpTrack: (index: number) => void;
  generateTracks: (tracks: Song[], index?: number, context?: context) => void;
  getTracks: () => Song[];
  getContext: () => context;
}

export type MusicStore = MusicStoreState & MusicStoreActions;

export const defaultMusicStore: MusicStoreState = {
  tracks: [] as Song[],
  currentIndex: -1,
  context: "",
  hydrated: false,
};

export const useMusicStore = create<
  MusicStore,
  [["zustand/persist", unknown], ["zustand/immer", never]]
>(
  persist(
    immer<MusicStore>((set, get) => ({
      ...defaultMusicStore,
      generateTracks: (tracks, index = 0, context: context = "playlist") =>
        set((state) => {
          state.tracks = tracks;
          state.currentIndex = index;
          state.context = context;
        }),

      setTracks: (tracks) =>
        set((state) => {
          state.tracks = tracks;
        }),
      pushTrack: (track) =>
        set((state) => {
          state.tracks.push(track);
        }),
      removeTrack: (index) => set((state) => state.tracks.splice(index, 1)),
      setCurrentIndex: (index) =>
        set((state) => {
          state.currentIndex = index;
        }),
      setContext: (context) =>
        set((state) => {
          state.context = context;
        }),

      jumpTrack: (index) =>
        set((state) => {
          state.currentIndex = index;
        }),
      setHydrated: () =>
        set((state) => {
          state.hydrated = true;
        }),
      getTracks: () => get().tracks,
      getContext: () => get().context,
    })),
    {
      // ...
      name: "music-storage",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);

export default useMusicStore;
