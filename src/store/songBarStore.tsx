import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// TODO: Add previousID to Music Store to look if the previousID match with the currentID
interface CurrentMusic {
  song?: Blob | undefined;
  title: string;
  artist: string;
  id?: number | undefined;
  preview_image: string;
}
interface SongBarStoreState {
  isPlaying: boolean;
  currentTime: number;
  writing: boolean;
  currentMusic: CurrentMusic;
  hydrated: boolean;
  searching: boolean;
  volume: number;
  songResults: SoundCloud.Search[];
}

interface SongBarActions {
  setVolume: (volume: number) => void;
  setWriting: (writing: boolean) => void;
  setIsPlaying: () => void;
  setPlaying: (isPlaying: boolean) => void;
  getIsPlaying: () => boolean;
  setCurrentMusic: (currentMusic: CurrentMusic) => void;
  setCurrentTime: (currentTime: number) => void;
  setSearching: (searching: boolean) => void;
  setHydrated: () => void;
  setSongResults: (songResults: SoundCloud.Search[]) => void;
}

export type SongBarStore = SongBarStoreState & SongBarActions;

export const defaultSongBarStore: SongBarStoreState = {
  isPlaying: false,
  currentTime: 0,
  writing: false,
  hydrated: false,
  currentMusic: {
    id: undefined,
    song: undefined,
    title: "",
    artist: "",
    preview_image: "",
  },
  searching: false,
  volume: 1.0,
  songResults: [],
};

export const useSongBarStore = create<
  SongBarStore,
  [["zustand/persist", unknown], ["zustand/immer", never]]
>(
  persist(
    immer<SongBarStore>((set, get) => ({
      ...defaultSongBarStore,
      setHydrated: () => set({ hydrated: true }),
      setVolume: (volume: number) => set({ volume }),
      setWriting: (writing: boolean) => set({ writing }),
      setIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (isPlaying: boolean) => set({ isPlaying }),
      getIsPlaying: () => {
        return get().isPlaying;
      },
      setCurrentMusic: (currentMusic: CurrentMusic) => set({ currentMusic }),
      setCurrentTime: (currentTime: number) => set({ currentTime }),
      setSearching: (searching: boolean) => set({ searching }),
      setSongResults: (songResults: SoundCloud.Search[]) =>
        set({ songResults }),
    })),
    {
      // ...
      name: "songbar-store",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);

export default useSongBarStore;
