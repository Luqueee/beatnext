"use server";
import { connectToMongoDB } from "./db";
import Fav from "@/models/favSchema";

export async function getFavs(username: string) {
  await connectToMongoDB();
  try {
    // Finding all todos

    const favs = await Fav.find({ username }, { songs: 1 }).lean();

    // Returning all todos

    return {
      res: favs[0]?.songs.map((song) => {
        return {
          id: song.id,
          title: song.title,
          cover: song.cover,
          artist: song.artist,
        };
      }),
    };
  } catch {
    // Returning an error message if todo retrieval fails
    return { res: null };
  }
}
