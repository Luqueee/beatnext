import { create } from "zustand";

interface ColorsStoreState {
  colors: string[];
  positionColor: number;
}

interface ColorsStoreActions {
  setColors: (colors: string[]) => void;
  setPositionColor: (position: number) => void;
  getPositionColor: () => number;
  getColors: () => string[];
}

export type ColorsStore = ColorsStoreState & ColorsStoreActions;

export const defaultColorsStore: ColorsStoreState = {
  colors: [],
  positionColor: 0,
};

export const useColorsStore = create<ColorsStore>((set, get) => ({
  ...defaultColorsStore,
  setColors: (colors) => {
    set(() => ({
      colors: colors,
    }));
  },
  setPositionColor: (position) => {
    set(() => ({
      positionColor: position,
    }));
  },
  getColors: () => {
    return get().colors;
  },
  getPositionColor: () => {
    return get().positionColor;
  },
}));

export default useColorsStore;
