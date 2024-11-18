"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatTimeWithMilliseconds } from "@/utils/formatTime";
import { extractColors } from "extract-colors";
import type { FinalColor } from "extract-colors/lib/types/Color";
import { Music2, ThumbsDown, ThumbsUp } from "lucide-react";
import useColorsStore from "@/store/colorsStore";
import { useSong, useValorate } from "../hooks";

const opacity = 0.8;

export default function SongBlock({
  song,
  handleIndex,
}: {
  song: SpotifyApi.RecommendationTrackObject;
  handleIndex: () => void;
}) {
  const [colors, setColors] = useState<string[] | undefined>(undefined);
  const [position, setPositionColor] = useState<number>(0);
  const { currentSong, likes, dislikes } = useSong(song, handleIndex);
  const { handleLike, handleDislike } = useValorate(handleIndex, currentSong);

  const {
    setColors: setColorsStore,
    setPositionColor: setPositionColorStore,
    getPositionColor,
  } = useColorsStore((state) => state);

  const handleGetColors = () => {
    if (currentSong?.cover)
      extractColors(currentSong?.cover)
        .then((colors: FinalColor[]) => {
          setColorsStore(
            colors.map((color) => {
              return `rgba(${color.red},${color.green}, ${color.blue}, ${opacity})`;
            })
          );

          setColors(
            colors.map((color) => {
              return `rgba(${color.red},${color.green}, ${color.blue}, ${opacity})`;
            })
          );
        })
        .catch(console.error);
  };

  useEffect(() => {
    setPositionColorStore(0);
    setPositionColor(0);
    if (currentSong?.cover) handleGetColors();
  }, [currentSong]);

  useEffect(() => {
    const interval = setInterval(() => {
      const position = getPositionColor();
      if (currentSong?.cover && colors) {
        if (position < colors?.length - 1) {
          setPositionColor(position + 1);
          setPositionColorStore(position + 1);
        } else {
          setPositionColor(0);
          setPositionColorStore(0);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [getPositionColor(), currentSong, colors]);

  return (
    <div className="w-[70vw] flex flex-col justify-center gap-12">
      <div className="w-full grid grid-cols-[auto_1fr] gap-12">
        {currentSong && (
          <>
            <Image
              width={250}
              height={250}
              src={currentSong.cover}
              alt="cover"
              draggable={false}
              className=" rounded-lg transition-all duration-500 "
              style={{
                boxShadow: `0 0 40px 10px ${colors ? colors[position] : ""}`,
              }}
            />
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-[500]">{currentSong.title}</h1>
              <h2 className="flex gap-2">
                <span>
                  <Music2 />{" "}
                </span>
                {currentSong.artists}
              </h2>
              <h3>{formatTimeWithMilliseconds(currentSong.duration)}</h3>

              <div className=" mt-4">
                <p>Likes: {likes}</p>
                <p>Dislikes: {dislikes}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-4">
        <button
          className="flex gap-4 items-center border border-white w-fit px-4 py-2 rounded-lg bg-white text-black"
          onClick={handleLike}
          type="button"
        >
          <span className="font-[600]">Like</span>
          <ThumbsUp stroke="#76e85f" strokeWidth={2} />
        </button>
        <button
          className="flex gap-4 items-center border border-white w-fit px-4 py-2 rounded-lg bg-white text-black"
          onClick={handleDislike}
          type="button"
        >
          <span className="font-[600]">Dislike</span>
          <ThumbsDown stroke="#d14c3b" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
