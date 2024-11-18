"use server";
import { SongRelation } from "@/models";
import { connectToMongoDB } from "./db";
import type { SongRelationType } from "@/models/songRelationsSchema";

export async function createRelation({ song }: { song: SongRelationType }) {
  await connectToMongoDB();
  // Extracting todo content and time from formData
  try {
    // Creating a new todo using Todo model
    const newRelation = await SongRelation.create({
      spotifyId: song.spotifyId,
      soundcloudId: song.soundcloudId,
      title: song.title,
      cover: song.cover,
      artists: song.artists,
      duration: song.duration,
      popularity: song.popularity,
    });
    // Saving the new todo
    newRelation.save();
    // Triggering revalidation of the specified path ("/")
    // Returning the string representation of the new todo
    console.log("new relation", newRelation);
    return {
      res: {
        _id: newRelation._id.toString(),
        spotifyId: newRelation.spotifyId,
        soundcloudId: newRelation.soundcloudId,
        title: newRelation.title,
        cover: newRelation.cover,
        artists: newRelation.artists,
        duration: newRelation.duration,
        popularity: newRelation.popularity,
      },
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("Error ocurred creating a relation", errorMessage);
    return {
      res: null,
    };
  }
}

export async function getRelation({ spotifyId }: { spotifyId: string }) {
  await connectToMongoDB();
  try {
    const relation = await SongRelation.findOne({ spotifyId });
    return {
      res: relation
        ? {
            _id: relation._id.toString(),
            spotifyId: relation.spotifyId,
            soundcloudId: relation.soundcloudId,
            title: relation.title,
            cover: relation.cover,
            artists: relation.artists,
            duration: relation.duration,
            popularity: relation.popularity,
          }
        : null,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("Error ocurred getting a relation", errorMessage);
    return {
      res: null,
    };
  }
}
