import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Genero musical
// Popularidad 0-100

interface TinderStoreState {
  genres: string[];
  hydrated?: boolean;
}

interface TinderStoreActions {
  addGenre: (genre: string) => void;
  removeGenre: (genre: string) => void;
  getGenres: () => string[];
  setGenres: (genres: string[]) => void;
  setHydrated: () => void;
}

export type TinderStore = TinderStoreState & TinderStoreActions;

export const defaultTinderStore: TinderStoreState = {
  genres: ["pop"],
};

export const useTinderStore = create<
  TinderStore,
  [["zustand/persist", unknown], ["zustand/immer", never]]
>(
  persist(
    immer<TinderStore>((set, get) => ({
      ...defaultTinderStore,
      addGenre: (genre) =>
        set((state) => {
          state.genres.push(genre);
        }),
      removeGenre: (genre) => {
        set((state) => {
          state.genres = state.genres.filter((g) => g !== genre);
        });
      },
      setGenres: (genres) => {
        set((state) => {
          state.genres = genres;
        });
      },
      getGenres: () => get().genres,
      setHydrated: () => {
        set((state) => {
          state.hydrated = true;
        });
      },
    })),
    {
      // ...
      name: "tinder-store",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);

export default useTinderStore;
