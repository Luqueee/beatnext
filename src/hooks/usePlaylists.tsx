import type { Playlist } from "@/models/playlistSchema";
import useProfileStore from "@/store/profileStore";
import { useEffect } from "react";

const usePlaylists = (): [Playlist[], (playlists: Playlist[]) => void] => {
  const { setPlaylists, playlists } = useProfileStore();

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

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return [playlists ?? [], setPlaylists];
};

export default usePlaylists;
