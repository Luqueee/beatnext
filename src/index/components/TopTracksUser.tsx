"use client";

import { useProfileStore } from "@/store";
import { useEffect, useState } from "react";
import type { session } from "@/auth";
import { Spotify } from "@/lib/spotify";

import Track from "./Track";
import BgBlock from "@/app/profile/playlists/[playlistid]/components/BgBlock";

export default function TopTracksUser({ session }: { session: session }) {
  const { setTopTracks: setTopTracksStore, getTopTracks } = useProfileStore();

  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>();

  useEffect(() => {
    const tracks = getTopTracks();

    if (tracks.length === 0) {
      if (session) {
        Spotify.getTopItemsUser({
          session,
          type: "tracks",
        }).then((topTracks) => {
          setTopTracksStore(topTracks as SpotifyApi.UsersTopTracksResponse[]);
          setTopTracks(topTracks as unknown as SpotifyApi.TrackObjectFull[]);
        });
      }
    } else {
      setTopTracks(tracks as unknown as SpotifyApi.TrackObjectFull[]);
    }
  }, [session]);
  return (
    <>
      {topTracks?.map((track) => (
        <BgBlock
          opacity={0.5}
          position={2}
          cover={track.album.images[0].url}
          key={track.id}
          className="h-32"
        >
          <Track track={track} />
        </BgBlock>
      ))}
    </>
  );
}
