"use client";
import { useAction } from "next-safe-action/hooks";
import { getFavSongsAction } from "../actions";
import { useEffect } from "react";
import type { Session } from "next-auth";
import FavSong from "./FavSong";
import useProfileStore from "@/store/profileStore";

export default function FavSongs({ session }: { session?: Session | null }) {
  const { favourites, setFavourites } = useProfileStore();

  const { execute } = useAction(getFavSongsAction, {
    onSuccess: ({ data, input }) => {
      console.log("Fav songs: ", data, input);
      if (data?.data) setFavourites(data.data);
    },
  });

  useEffect(() => {
    if (session) {
      execute({ username: session?.user?.name as string });
    }
  }, [session]);

  return (
    <div className=" p-4">
      {favourites.map((song) => (
        <FavSong key={song.id} song={song} />
      ))}
    </div>
  );
}
