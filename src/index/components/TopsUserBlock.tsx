"use client";
import type { session } from "@/auth";
import { Spotify } from "@/lib/spotify";
import { useProfileStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function TopUserBlock({ session }: { session: session }) {
  const { setTopArtists: setTopArtistsStore, setTopTracks: setTopTracksStore } =
    useProfileStore();

  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>();
  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>();
  useEffect(() => {
    if (session) {
      Spotify.getTopItemsUser({
        session,
        type: "tracks",
      }).then((topTracks) => {
        setTopTracksStore(topTracks as SpotifyApi.UsersTopTracksResponse[]);
        setTopTracks(topTracks as unknown as SpotifyApi.TrackObjectFull[]);
      });
      Spotify.getTopItemsUser({
        session,
        type: "artists",
      }).then((topArtists) => {
        setTopArtistsStore(topArtists as SpotifyApi.UsersTopArtistsResponse[]);
        setTopArtists(topArtists as unknown as SpotifyApi.ArtistObjectFull[]);
        console.log(topArtists);
      });
    }
  }, [session]);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-2xl">Tus canciones mas escuchadas</p>

        <div className="grid grid-cols-3 gap-4">
          {topTracks?.map((track) => (
            <Link href={`/track/${track.id}`} key={track.id} className="w-fit">
              <div className="inline-flex">
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
      <div>
        <p className=" text-2xl">Tus artistas mas escuchados:</p>
        <div className="grid grid-cols-3 gap-4">
          {topArtists?.map((artist) => (
            <Link href={`/artist/${artist.id}`} key={artist.id}>
              <div className="flex gap-4">
                <Image
                  src={artist.images[0]?.url}
                  width={100}
                  height={100}
                  alt={artist.name}
                  className="rounded-lg"
                />
                <div>
                  <h2>{artist.name}</h2>
                  <p>{artist.popularity}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
