"use client";

import type { session } from "@/auth";
import { Spotify } from "@/lib/spotify";
import { useProfileStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function RecomendationsBlock({ session }: { session: session }) {
  const [recomendations, setRecomendations] =
    useState<SpotifyApi.RecommendationsObject>();

  const { setTopArtists, setTopTracks } = useProfileStore();

  useEffect(() => {
    if (session) {
      Spotify.getRecommendations({
        session,
      }).then((recomendations) => {
        console.log(recomendations);
        setRecomendations(recomendations);
      });

      Spotify.getTopItemsUser({
        session,
        type: "tracks",
      }).then((topTracks) => {
        setTopTracks(topTracks as SpotifyApi.UsersTopTracksResponse[]);
      });
      Spotify.getTopItemsUser({
        session,
        type: "artists",
      }).then((topTracks) => {
        setTopArtists(topTracks as SpotifyApi.UsersTopArtistsResponse[]);
      });
    }
  }, [session]);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-2xl">Algunas de nuestras recomendaciones</p>
      <div className="grid grid-cols-3 gap-4">
        {recomendations?.tracks?.map((track) => (
          <Link href={`/track/${track.id}`} key={track.id}>
            <div className="flex gap-4">
              <Image
                src={track.album.images[0].url}
                width={100}
                height={100}
                alt={track.name}
                className="rounded-lg"
              />
              <div>
                <h2>{track.name}</h2>
                <p>{track.artists[0].name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
