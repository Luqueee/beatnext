import type { Playlist } from "@/models/playlistSchema";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { deletePlaylistAction } from "../actions/deletePlaylist";
import { useProfileStore } from "@/store";

const usePlaylists = (): {
  playlists: Playlist[];
  deletePlaylist: (id: string | undefined) => void;
} => {
  const [playlists, setPlaylists] = useState([]);

  const { getPlaylists, deletePlaylist: deletePlaylistStore } =
    useProfileStore();

  const { execute } = useAction(deletePlaylistAction, {
    onSuccess: ({ input }) => {
      deletePlaylistStore(input.id);
    },
  });

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("/api/profile/playlists");
      const { data } = await res.json();
      setPlaylists(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePlaylist = async (id: string | undefined) => {
    if (id) execute({ id });
  };
  useEffect(() => {
    fetchPlaylists();
  }, [getPlaylists()]);

  return { playlists, deletePlaylist };
};

export default usePlaylists;
