"use server";
import { auth } from "@/auth";
import { connectToMongoDB } from "./db";
import Playlist, { type Song } from "@/models/playlistSchema";

export async function createPlaylist({
  username,
  title,
  cover,
  description,
}: {
  username: string;
  title: string;
  cover?: string;
  description?: string;
}) {
  await connectToMongoDB();
  // Extracting todo content and time from formData

  console.log("creating playlist", { username, title, cover, description });

  try {
    // Creating a new todo using Todo model
    const newPlaylist = await Playlist.create({
      username,
      title,
      cover,
      description,
    });
    // Saving the new todo
    newPlaylist.save();
    // Triggering revalidation of the specified path ("/")

    // Returning the string representation of the new todo
    console.log("new playlist", newPlaylist);
    return newPlaylist;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("error creating playlist", errorMessage);
    return {
      message: `error creating playlist: ${errorMessage}`,
      params: { username, title },
    };
  }
}

export async function getPlaylistByUsername(username: string, title: string) {
  await connectToMongoDB();
  try {
    // Finding all todos
    const playlist = await Playlist.find(
      { username, title },
      { title: 1, id: 1, cover: 1 }
    ).lean();
    // Returning all todos
    return { res: playlist };
  } catch {
    // Returning an error message if todo retrieval fails
    return { res: null };
  }
}

export async function addSongToPlaylist({
  username,
  title,
  song,
}: {
  username: string;
  title: string;

  song: Song;
}) {
  await connectToMongoDB();

  console.log("adding song to playlist: ", title, song, username);
  try {
    // Recupera la playlist primero
    const playlist = await Playlist.findOneAndUpdate(
      { username, title },
      { $setOnInsert: { songs: [] } },
      { upsert: true, new: true }
    );

    console.log("playlist", playlist);

    if (!playlist) {
      console.log("Playlist not found");
      return { res: null };
    }

    // Verifica si la canción ya existe en el array songs
    if (playlist.songs?.some((s) => s.id === song.id)) {
      console.log("La canción ya existe en la playlist", playlist);
      return "la cancion ya existe en la playlist"; // O devuelve un error, según prefieras
    }

    // Si no existe, agrégala
    playlist.songs.push(song);

    console.log("playlist pushed", playlist.songs);
    await playlist.save();

    console.log("song added to playlist", playlist);
    return "song added to playlist";
  } catch (error) {
    console.log(
      `error adding song to playlist: ${title} - ${song.id} ${song.title}`,
      error
    );
    return { res: null };
  }
}

export async function deleteSongFromPlaylist({
  username,
  title,
  id,
}: {
  username: string;
  title: string;
  id: number;
}) {
  await connectToMongoDB();
  try {
    // Recupera la playlist primero
    console.log("deleting song from playlist: ", title, id, username);

    const playlist = await Playlist.findOne({ username, title });

    if (!playlist) {
      console.log("Playlist not found");
      return { res: null };
    }

    // Filtra la canción a eliminar
    playlist.songs = playlist.songs.filter((s) => s.id !== id);
    await playlist.save();

    console.log("song deleted from playlist", playlist);
    return "song deleted from playlist";
  } catch (error) {
    console.log("error deleting song from playlist", error);
    return { res: null };
  }
}

export async function toogleVisibilityPlaylist({ id }: { id: string }) {
  await connectToMongoDB();
  const username = (await auth())?.user?.name;
  try {
    // Recupera la playlist primero
    const playlist = await Playlist.findOne({ username, _id: id });

    if (!playlist) {
      console.log("Playlist not found");
      return { res: null };
    }

    playlist.visible = !playlist.visible;
    await playlist.save();

    // Filtra la canción a eliminar
    console.log("toogle visibility playlist: ", id, playlist);
  } catch (error) {
    console.log("error deleting song from playlist", error);
    return { res: null };
  }
}

export async function deletePlaylist({ id }: { id: string }) {
  await connectToMongoDB();
  const username = (await auth())?.user?.name;
  try {
    // Recupera la playlist primero
    const playlist = await Playlist.findOneAndDelete({ username, _id: id });

    if (!playlist) {
      console.log("Playlist not found");
      return { res: null };
    }

    console.log("playlist deleted", playlist);
    return "playlist deleted";
  } catch (error) {
    console.log("error deleting playlist", error);
    return { res: null };
  }
}
