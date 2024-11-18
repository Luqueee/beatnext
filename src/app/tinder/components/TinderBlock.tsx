"use client";

import { useEffect, useState } from "react";
import type { session } from "@/auth";
import SongBlock from "./SongBlock";
import { useProfileStore, useTinderStore } from "@/store";
import { Spotify } from "@/lib/spotify";
import ModalConfig from "./ModalConfig";
export default function TinderBlock({ session }: { session: session }) {
  const {
    getRecommendations,
    setRecommendations: setRecommendationsStore,
    removeRecomendation,
  } = useProfileStore();

  const { genres } = useTinderStore();

  const [recommendations, setRecommendations] =
    useState<SpotifyApi.RecommendationTrackObject[]>();

  const [index, setIndex] = useState(0);

  const generateNewRecommendations = async () => {
    console.log("generando recomendaciones", genres);

    await Spotify.getRecommendations({
      session,
      genres: genres,
    }).then(async (recomendations) => {
      console.log("haciendo peticion recomendaciones", recomendations);
      setRecommendationsStore(recomendations?.tracks);
      setRecommendations(recomendations?.tracks);
      setIndex(0);
    });
  };

  useEffect(() => {
    if (session) {
      const tracks = getRecommendations();
      console.log("tracks", tracks);
      if (tracks.length === 0) {
        generateNewRecommendations();
      } else {
        setRecommendations(tracks);
      }
    }
  }, [session]);

  const handleIndex = async () => {
    console.log("index", index, recommendations);
    if (recommendations === undefined) return;
    if (index === recommendations?.length - 1) {
      generateNewRecommendations();
    }
    removeRecomendation();
    setIndex((prev) => prev + 1);
  };

  return (
    <div
      className="min-h-full relative flex items-center justify-center transition-all duration-500 bg-opacity-20"
      // style={{
      //   backgroundColor: currentColor,
      // }}
    >
      {recommendations && (
        <SongBlock song={recommendations[index]} handleIndex={handleIndex} />
      )}
      <ModalConfig generate={generateNewRecommendations} />
    </div>
  );
}
