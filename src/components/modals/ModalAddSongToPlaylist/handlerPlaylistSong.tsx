import type { Playlist } from "@/models/playlistSchema";

type song = {
  id: number;
  title: string;
  cover: string;
};
const handleAddSongToPlaylist = (title: string, song: song) => {
  console.log("adding song to playlist: ", title, song);
  fetch("/api/profile/playlist", {
    method: "POST",
    body: JSON.stringify({
      ...song,
      title_song: title,
    }),
  }).then(async (res) => {
    const response = await res.json();
    console.log("song added to playlist", response);
  });
};

const handleDeleteSongFromPlaylist = (title: string, song: song) => {
  console.log("adding song to playlist: ", title);
  fetch(`/api/profile/playlist?id=${song.id}&title=${title}`, {
    method: "DELETE",
  }).then(async (res) => {
    const response = await res.json();
    console.log("song added to playlist", response);
  });
};

const handlerPlaylistSong = (
  isInPlaylist: boolean,
  song: song,
  playlist: Playlist
) => {
  if (isInPlaylist) {
    handleDeleteSongFromPlaylist(playlist.title, song);
  } else {
    handleAddSongToPlaylist(playlist.title, song);
  }
};

export default handlerPlaylistSong;
