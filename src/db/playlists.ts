import { connectToMongoDB } from "./db";
import Playlist, { type Song as OriginalSong } from "@/models/playlistSchema";

interface Song extends OriginalSong {
  _id: string;
  id: number;
  title: string;
  cover: string;
  artist: string;
}

export interface getPlaylistById {
  title: string;
  cover?: string;
  description?: string;
  username: string;
  songs: Song[];
  visible: boolean | undefined;
  _id: string;
}

export async function getAllPlaylistsByUsername(username: string) {
  await connectToMongoDB();
  try {
    // Finding all todos
    const playlists = await Playlist.find(
      { username },
      { _id: 1, title: 1, cover: 1, songs: 1 }
    ).lean();
    // Returning all todos
    return { res: playlists };
  } catch {
    // Returning an error message if todo retrieval fails
    return { res: null };
  }
}

export async function getPlaylistById(
  id: string
): Promise<{ data: getPlaylistById | null }> {
  await connectToMongoDB();
  try {
    // Finding a todo by its id
    const playlist = await Playlist.findOne({ _id: id }).lean();

    if (!playlist) {
      return { data: null };
    }

    const { title, cover, description, username, visible, _id } = playlist;

    const songs: Song[] = (playlist.songs as Song[]).map((song: Song) => ({
      ...song,
      _id: song._id.toString(),
    }));

    console.log("songs", songs);

    const id_string = _id.toString();

    // console.log("playlist", {
    //   title,
    //   cover,
    //   description,
    //   username,
    //   visible,
    //   songs,
    //   id_string,
    // });
    // Returning the found playlist
    return {
      data: {
        _id: id_string,
        title,
        cover,
        description,
        username,
        visible,
        songs: songs,
      },
    };
  } catch {
    // Returning an error message if todo retrieval fails
    return { data: null };
  }
}

export async function getPlaylists(): Promise<
  | {
      _id: string;
      title: string;
      cover: string;
      username: string;
    }[]
  | null
> {
  await connectToMongoDB();
  try {
    // Finding all todos
    const playlists = await Playlist.find(
      { visible: true },
      { _id: 1, title: 1, cover: 1, username: 1 }
    ).lean();
    // Returning all todos
    return playlists.map((playlist) => ({
      _id: playlist._id.toString(),
      title: playlist.title,
      cover: playlist.cover || "",
      username: playlist.username,
    }));
  } catch {
    // Returning an error message if todo retrieval fails
    return null;
  }
}
