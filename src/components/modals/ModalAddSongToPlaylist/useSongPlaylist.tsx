import type { Playlist, Song } from "@/models/playlistSchema";
import useProfileStore from "@/store/profileStore";
import { useEffect, useState } from "react";

const useSongPlaylist = (
  playlist: Playlist,
  song: Song
): [boolean, (value: boolean) => void] => {
  const [isSongInPlaylist, setIsSongInPlaylist] = useState<boolean>(false);

  const { setAddSongToPlaylist, setDeleteSongFromPlaylist, playlists } =
    useProfileStore();

  useEffect(() => {
    const isSong = playlist.songs.some(
      (playlistSong: { id: number; title: string; cover: string }) =>
        playlistSong.id === song.id
    );

    console.log(
      `isSong: ${song.title} in playlist: ${playlist.title} `,
      isSong
    );

    setIsSongInPlaylist(isSong);
  }, []);

  const setAddedSongToPlaylist = (value: boolean) => {
    setIsSongInPlaylist(value);
    if (!value) {
      setAddSongToPlaylist(song, playlist);
    } else {
      setDeleteSongFromPlaylist(song, playlist);
    }

    console.log(
      "isSongInPlaylist: ",
      isSongInPlaylist,
      playlists?.find((p) => p.title === playlist.title)
    );
  };

  return [isSongInPlaylist, setAddedSongToPlaylist];
};

export default useSongPlaylist;
