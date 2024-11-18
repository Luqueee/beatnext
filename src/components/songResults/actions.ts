"use server"; // don't forget to add this!

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { addFav } from "@/db/fav";
import { revalidatePath } from "next/cache";

// This schema is used to validate input from client.
const favSchema = z.object({
  title: z.string(),
  username: z.string(),
  id: z.number(),
  cover: z.string(),
  artist: z.string(),
});

export const createFavAction = actionClient
  .schema(favSchema)
  .action(async ({ parsedInput: { title, username, id, cover, artist } }) => {
    await addFav({ id, username, title, cover, artist });
    revalidatePath("/", "page");
    return { success: "Fav song created" };
  });
