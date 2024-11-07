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

interface MusicStoreState {
  isPlaying: boolean;
  currentTime: number;
  previousID: number;
  writing: boolean;
  currentMusic: CurrentMusic;
  hydrated: boolean;
  searching: boolean;
  volume: number;
  songResults: SoundCloud.Search[];
}

interface MusicStoreActions {
  setVolume: (volume: number) => void;
  setWriting: (writing: boolean) => void;
  setIsPlaying: () => void;
  setPlaying: (isPlaying: boolean) => void;
  getIsPlaying: () => boolean;
  setCurrentMusic: (currentMusic: CurrentMusic) => void;
  setCurrentTime: (currentTime: number) => void;
  setPreviousID: (previousID: number) => void;
  setSearching: (searching: boolean) => void;
  setHydrated: () => void;
  setSongResults: (songResults: SoundCloud.Search[]) => void;
}

export type MusicStore = MusicStoreState & MusicStoreActions;

export const defaultMusicStore: MusicStoreState = {
  isPlaying: false,
  currentTime: 0,
  previousID: 0,
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

export const useMusicStore = create<
  MusicStore,
  [["zustand/persist", unknown], ["zustand/immer", never]]
>(
  persist(
    immer<MusicStore>((set, get) => ({
      ...defaultMusicStore,
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
      setPreviousID: (previousID: number) => set({ previousID }),
      setSearching: (searching: boolean) => set({ searching }),
      setSongResults: (songResults: SoundCloud.Search[]) =>
        set({ songResults }),
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

export const musicStore = useMusicStore;
