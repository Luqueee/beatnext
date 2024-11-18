"use server"; // don't forget to add this!

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { deletePlaylist } from "@/db/playlist";

// This schema is used to validate input from client.
const playlistSchema = z.object({
  id: z.string(),
});

export const deletePlaylistAction = actionClient
  .schema(playlistSchema)
  .action(async ({ parsedInput: { id } }) => {
    console.log("deleting playlist", id);
    const res = await deletePlaylist({ id });
    return { data: res };
  });
