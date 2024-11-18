"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Playlist, Song } from "@/models/playlistSchema";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import handlerPlaylistSong from "./handlerPlaylistSong";
import useSongPlaylist from "./useSongPlaylist";
import { cn } from "@/lib/utils";
import useModalStore from "@/store/modalsStore";
import useProfileStore from "@/store/profileStore";
import { useEffect } from "react";

export default function ModalAddSongToPlaylist() {
  const { currentSongPlaylist, isOpenModalPlaylist, setOpenModalPlaylist } =
    useModalStore();

  const { playlists, setPlaylists } = useProfileStore();

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("/api/profile/playlists");
      const { data } = await res.json();
      setPlaylists(data);
      console.log("playlists: ", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlerOpenModal = (open: boolean) => {
    setOpenModalPlaylist(open);

    if (!open) {
      fetchPlaylists();
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <Dialog
      open={isOpenModalPlaylist}
      onOpenChange={(open) => handlerOpenModal(open)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir a playlist</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {playlists?.map((playlist) => (
            <BlockPlaylist
              key={playlist.title}
              playlist={playlist}
              song={currentSongPlaylist}
            />
          ))}
        </div>
        <DialogFooter>
          <DialogClose className=" bg-red-600" asChild>
            <Button variant="ghost">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const BlockPlaylist = ({
  playlist,
  song,
  ...params
}: {
  playlist: Playlist;
  song: Song;
}) => {
  const [isSongInPlaylist, setAddedSongToPlaylist] = useSongPlaylist(
    playlist,
    song
  );

  const handlerPlaylistSongChange = async () => {
    handlerPlaylistSong(isSongInPlaylist, song, playlist);
    setAddedSongToPlaylist(!isSongInPlaylist);
  };

  return (
    <Button
      onClick={handlerPlaylistSongChange}
      className={cn(isSongInPlaylist ? "bg-green-600" : "bg-red-800")}
      {...params}
    >
      <span>{playlist.title}</span>
    </Button>
  );
};
