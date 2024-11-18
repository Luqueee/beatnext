"use client";

import { useProfileStore } from "@/store";
import { useEffect, useState } from "react";
import type { session } from "@/auth";
import { Spotify } from "@/lib/spotify";
import Image from "next/image";
import BgBlock from "@/app/profile/playlists/[playlistid]/components/BgBlock";

export default function TopArtistsUser({ session }: { session: session }) {
  const { setTopArtists: setTopArtistsStore, getTopArtists } =
    useProfileStore();

  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>();

  useEffect(() => {
    if (session) {
      const artists = getTopArtists();

      console.log("Top artists", artists);

      if (artists.length === 0) {
        Spotify.getTopItemsUser({
          session,
          type: "artists",
        }).then((topArtists) => {
          setTopArtistsStore(
            topArtists as SpotifyApi.UsersTopArtistsResponse[]
          );
          setTopArtists(topArtists as unknown as SpotifyApi.ArtistObjectFull[]);
        });
      } else {
        setTopArtists(artists as unknown as SpotifyApi.ArtistObjectFull[]);
      }
    }
  }, [session]);
  return (
    <>
      {topArtists?.map((track) => (
        <BgBlock
          opacity={0.5}
          position={2}
          cover={track.images[0].url}
          key={track.id}
          className="h-32"
        >
          <div className="p-4 flex gap-4 h-full">
            <Image
              src={track.images[0].url}
              width={70}
              height={70}
              alt={track.name}
              className="rounded-full aspect-square"
            />

            <div className="relative">
              <h2>{track.name}</h2>
              <p className="">{track.popularity}</p>
            </div>
          </div>
        </BgBlock>
      ))}
    </>
  );
}
