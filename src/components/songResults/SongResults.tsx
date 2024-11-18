"use client";
import { useCallback } from "react";
import type { Session } from "next-auth";
import CardResult from "./CardResult";
import type { FavSongProps } from "@/app/profile/favs/components/FavSong";
import usePlaylists from "@/hooks/usePlaylists";
import { useMusicStore, useSongBarStore } from "@/store";
export default function SongResults({
  session,
  favs,
}: {
  session?: Session | null;
  favs?: FavSongProps[];
}) {
  const { setCurrentMusic, setCurrentTime, songResults, setPlaying } =
    useSongBarStore((state) => state);

  const { getTracks, generateTracks, getContext } = useMusicStore(
    (state) => state
  );

  const [playlists] = usePlaylists();

  // useEffect(() => {
  //   console.log("results: ", songResults);
  // }, [songResults]);

  const fetchSong = useCallback(
    (artwork_url: string, id: number, title: string, artist: string) => {
      //setCurrentMusic({ preview_image: artwork_url, id, title, artist });
      //setCurrentTime(0);
      generateTracks([{ cover: artwork_url, id, title, artist }], 0, "search");
      setPlaying(true);
      console.log("tracks", getTracks(), getContext());
    },
    [setCurrentMusic, setCurrentTime]
  );

  return (
    <div className="py-4">
      <div className="flex flex-col gap-4 px-2">
        {songResults.map((result) => {
          const isFav =
            favs?.some((fav: FavSongProps) => fav.id === result.id) ?? false;

          return (
            <CardResult
              playlists={playlists}
              song_data={result}
              isFavSong={isFav}
              fetchSong={fetchSong}
              key={result.id}
              session={session}
            />
          );
        })}
      </div>
    </div>
  );
}
