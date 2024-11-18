"use server"; // don't forget to add this!

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { getFavs } from "@/db/favs";

// This schema is used to validate input from client.
const favSchema = z.object({
  username: z.string(),
});

export const getFavSongsAction = actionClient
  .schema(favSchema)
  .action(async ({ parsedInput: { username } }) => {
    const res = await getFavs(username);
    return { data: res.res };
  });
