"use server";
import Fav from "@/models/favSchema";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "./db";

// Falta sincronizar con la base de datos los favs de spotify : )

export async function addFav({
  username,
  title,
  id,
  cover,
  artist,
}: {
  username: string;
  title: string;
  id: number;
  cover: string;
  artist: string;
}) {
  await connectToMongoDB();
  // Extracting todo content and time from formData
  try {
    // Creating a new todo using Todo model

    const existingFav = await Fav.findOne({ username });

    if (existingFav) {
      existingFav.songs.push({ id, title, cover, artist });
      await existingFav.save();
      const plainObject = JSON.parse(JSON.stringify(existingFav));
      console.log("updated fav song", plainObject);
      return plainObject;
    }

    const newFav = await Fav.create({
      username,
      cover,
      songs: [{ id, title, cover, artist }],
    });
    // Saving the new todo
    await newFav.save();
    // Triggering revalidation of the specified path ("/")
    // Returning a plain JavaScript object
    const plainObject = JSON.parse(JSON.stringify(newFav));
    console.log("new fav song", plainObject);
    return plainObject;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("error creating fav song", errorMessage);
    return {
      message: `error creating fav song: ${errorMessage}`,
      params: { username, title, id },
    };
  }
}

export async function deleteFav(id: number, username: string) {
  // Extracting todo ID from formData
  try {
    // Deleting the todo with the specified ID

    const fav = await Fav.findOne({ username });

    if (fav) {
      fav.songs = fav.songs.filter((song) => song.id !== id);
      await fav.save();
      console.log("updated fav after deletion", fav);
    }
    // Triggering revalidation of the specified path ("/")
    revalidatePath("/");
    // Returning a success message after deleting the todo
    return "fav deleted";
  } catch (error) {
    // Returning an error message if todo deletion fails
    const errorMessage = (error as Error).message;
    return { message: `error deleting todo ${errorMessage}` };
  }
}

export async function getFav(id: number, username: string) {
  await connectToMongoDB();
  try {
    // Finding a todo with the specified ID

    const fav = await Fav.findOne({
      id,
      username,
    }).lean();

    // Returning the todo if found
    return { res: fav };
  } catch {
    // Returning an error message if todo retrieval fails
    return { res: null };
  }
}
