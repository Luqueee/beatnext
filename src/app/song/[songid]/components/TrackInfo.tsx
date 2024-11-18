"use client";
import type { session } from "@/auth";
import Spotify from "@/lib/spotify/spotify";
import { useEffect, useState } from "react";
export default function TrackInfo({
  session,
  track,
}: {
  session: session;
  track: SoundCloud.Track;
}) {
  const [trackInfo, setTrackInfo] =
    useState<SpotifyApi.AudioFeaturesObject | null>(null);

  useEffect(() => {
    Spotify.getSpotifyTrackFeatures(track.title, session).then(
      (info_spotify) => {
        console.log(info_spotify);
        setTrackInfo(info_spotify);
      }
    );
  }, []);
  return (
    <div>
      <p>Song data</p>
      {trackInfo && (
        <div>
          <p>Key: {trackInfo.key}</p>
          <p>Danceability: {trackInfo.danceability}</p>
          <p>Tempo: {trackInfo.tempo}</p>
          <p>Time Signature: {trackInfo.time_signature}</p>
          <p>Mode: {trackInfo.mode}</p>
        </div>
      )}
    </div>
  );
}
