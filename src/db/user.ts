"use server";
import User from "@/models/userSchema";
import { revalidatePath } from "next/cache";
import { connectToMongoDB } from "./db";
import type { session } from "@/auth";

export async function createUser({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string;
}) {
  await connectToMongoDB();
  // Extracting todo content and time from formData
  try {
    console.log("creating user", { name, email, image });

    // Creating a new todo using Todo model
    const newUser = await User.create({
      username: name,
      email,
      image,
    });
    // Saving the new todo
    newUser.save();
    // Triggering revalidation of the specified path ("/")
    //revalidatePath("/");
    // Returning the string representation of the new todo
    console.log("new user", newUser);
    return newUser.toString();
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("error creating user", errorMessage);
    return null;
  }
}

export async function getUser(session: session) {
  await connectToMongoDB();
  try {
    // Finding user by email
    const user = await User.findOne({ email: session?.user?.email }).lean();

    // Returning the user
    return user;
  } catch {
    // Returning an error message if user retrieval fails
    return { res: null };
  }
}

export async function deleteUser(id: FormData) {
  // Extracting todo ID from formData
  const todoId = id.get("id");
  try {
    // Deleting the todo with the specified ID
    await User.deleteOne({ _id: todoId });
    // Triggering revalidation of the specified path ("/")
    revalidatePath("/");
    // Returning a success message after deleting the todo
    return "todo deleted";
  } catch {
    // Returning an error message if todo deletion fails
    return { message: "error deleting todo" };
  }
}
