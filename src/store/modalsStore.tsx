import type { Song } from "@/models/playlistSchema";
import { create } from "zustand";

interface ModalStoreState {
  isOpenModalPlaylist: boolean;
  currentSongPlaylist: Song;
}

interface ModalStoreActions {
  setOpenModalPlaylist: (isOpenModalPlaylist: boolean) => void;
  setCurrentSongPlaylist: (currentSongPlaylist: Song) => void;
}

export type ModalStore = ModalStoreState & ModalStoreActions;

export const defaultModalStore: ModalStoreState = {
  isOpenModalPlaylist: false,
  currentSongPlaylist: {
    id: 0,
    title: "",
    cover: "",
    artist: "",
  },
};

export const useModalStore = create<ModalStore>((set) => ({
  ...defaultModalStore,
  setOpenModalPlaylist: (isOpenModalPlaylist) => {
    set(() => ({
      isOpenModalPlaylist: isOpenModalPlaylist,
    }));
  },
  setCurrentSongPlaylist: (currentSongPlaylist) => {
    set(() => ({
      currentSongPlaylist: currentSongPlaylist,
    }));
  },
}));

export default useModalStore;
