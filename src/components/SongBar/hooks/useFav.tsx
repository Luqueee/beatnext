"use client";

import { CreateFavAction } from "@/actions";
import type { FavSongProps } from "@/app/profile/favs/components/FavSong";
import type { session } from "@/auth";
import { deleteFav } from "@/db/fav";
import { getFavs } from "@/db/favs";
import type { Song } from "@/models/playlistSchema";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

interface SongParams {
  title: string;
  artist: string;
  image: string;
  url: string;
  id: string;
}

const useFav = (
  songParams:
    | SongParams
    | (Song & {
        image: string;
      })
    | null,
  session: session
) => {
  const [isFav, setIsFav] = useState<boolean>(false);

  const { execute: executeFav } = useAction(CreateFavAction, {
    onSuccess: ({ data, input }) => {
      console.log("Fav song created", data, input);
    },
  });

  const handleFav = () => {
    if (!songParams) return;
    if (isFav) {
      console.log("removing fav...");
      deleteFav(Number(songParams.id), session?.user?.name ?? "").then(
        (res) => {
          console.log("fav deleted", res);
          setIsFav(false);
        }
      );
    } else {
      executeFav({
        id: Number(songParams?.id),
        title: songParams?.title,
        cover: songParams?.image,
        artist: songParams?.artist,
        username: session?.user?.name ?? "",
      });
      setIsFav(true);
    }
  };

  useEffect(() => {
    if (songParams)
      getFavs(session?.user?.name as string).then((value) => {
        const favs = value.res as unknown as FavSongProps[];
        setIsFav(favs?.some((fav) => fav.id === Number(songParams.id)));
        return value;
      });
  }, [songParams]);

  return {
    isFav,
    handleFav,
  };
};

export default useFav;
