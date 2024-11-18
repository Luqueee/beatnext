"use server";
import { connectToMongoDB } from "./db";
import Tinder from "@/models/tinderSchema";

export async function createSong({
  spotifyId,
  soundcloudId,
  artist,
  title,
  cover,
}: {
  spotifyId: string;
  soundcloudId: number;
  artist: string;
  title: string;
  cover: string;
}) {
  await connectToMongoDB();
  try {
    // Check if a song with the same soundcloudId already exists
    const existingSong = await Tinder.findOne({ soundcloudId });
    if (existingSong) {
      throw new Error("Song with this soundcloudId already exists");
    }

    // Creating a new song document
    const song = new Tinder({
      spotifyId,
      soundcloudId,
      artist,
      title,
      cover,
    });

    // Saving the song document to the database
    await song.save();
  } catch {
    return { res: null };
  }
}

export async function getSong({
  spotifyId = null,
}: {
  spotifyId?: string | null;
}) {
  await connectToMongoDB();
  try {
    // Finding the song with the specified id
    const song = await Tinder.findOne({
      spotifyId,
    });

    // If the song is not found, throw an error
    if (!song) {
      throw new Error("Song not found");
    }

    return {
      res: {
        _id: song._id.toString(),
        spotifyId: song.spotifyId,
        soundcloudId: song.soundcloudId,
        artist: song.artist,
        title: song.title,
        cover: song.cover,
        likes: song.likes,
        dislikes: song.dislikes,
      },
    };
  } catch (error) {
    console.error(error);
  }
}

export async function valorateSong({
  spotifyId = null,

  like,
}: {
  spotifyId?: string | null;
  soundcloudId?: number | null;
  like: boolean;
}) {
  await connectToMongoDB();
  try {
    // Finding the todo with the specified id
    const song = await Tinder.findOne({
      spotifyId,
    });

    // If the song is not found, throw an error
    if (!song) {
      throw new Error("Song not found");
    }

    // If the song is found, increment the likes or dislikes count
    if (like) {
      song.likes++;
    } else {
      song.dislikes++;
    }

    console.log(song);
    song.save();
  } catch (error) {
    console.error(error);
  }
}

export async function getAllResults(): Promise<{
  res: {
    _id: string;
    spotifyId: string;
    soundcloudId: number;
    artist: string;
    title: string;
    cover: string;
    likes: number;
    dislikes: number;
  }[];
}> {
  await connectToMongoDB();
  try {
    // Finding all the songs in the database
    const songs = await Tinder.find({ likes: { $gt: 0 } }).sort({ likes: -1 });

    return {
      res: songs.map((song) => ({
        _id: song._id.toString(),
        spotifyId: song.spotifyId,
        soundcloudId: Number(song.soundcloudId),
        artist: song.artist,
        title: song.title,
        cover: song.cover,
        likes: song.likes,
        dislikes: song.dislikes,
      })),
    };
  } catch (error) {
    console.error(error);
    return { res: [] };
  }
}
