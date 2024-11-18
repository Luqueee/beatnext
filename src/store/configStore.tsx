import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// Genero musical
// Popularidad 0-100

interface ConfigStoreState {
  userCreated: boolean;
  hydrated?: boolean;
}

interface ConfigStoreActions {
  setUserCreated: (userCreated: boolean) => void;
  getUserCreated: () => boolean;
  setHydrated: () => void;
}

export type ConfigStore = ConfigStoreState & ConfigStoreActions;

export const defaultConfigStore: ConfigStoreState = {
  userCreated: false,
};

export const useConfig = create<
  ConfigStore,
  [["zustand/persist", unknown], ["zustand/immer", never]]
>(
  persist(
    immer<ConfigStore>((set, get) => ({
      ...defaultConfigStore,
      setUserCreated: (userCreated) =>
        set(() => ({
          userCreated: userCreated,
        })),
      getUserCreated: () => get().userCreated,
      setHydrated: () => {
        set(() => ({
          hydrated: true,
        }));
      },
    })),
    {
      // ...
      name: "config-store",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);

export default useConfig;
