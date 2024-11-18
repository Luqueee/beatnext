/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMusicStore, useSongBarStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  ListVideo,
} from "lucide-react";
import CurrentSong from "./CurrentSong";
import VolumeControl from "./VolumeControl";
import SongControl from "./SongControl";
import { useConfig, useNext } from "./hooks";
import type { session } from "@/auth";
import useFav from "./hooks/useFav";
import useModalPlaylist from "@/hooks/useModalPlaylist";

export default function SongBar({ session }: { session: session }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    isPlaying,
    setIsPlaying,
    searching,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    currentMusic,
    setPlaying,
  } = useSongBarStore((state) => state);

  const { currentIndex } = useMusicStore((state) => state);
  const [next, prev] = useNext();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { songParams, duration, configMusic, setDuration } = useConfig({
    playerRef: audioRef.current,
  });

  const { isFav, handleFav } = useFav(songParams, session);
  const { handleOpenModalPlaylist } = useModalPlaylist({
    title: songParams?.title ?? "",
    artist: songParams?.artist ?? "",
    cover: songParams?.image ?? "",
    id: Number(songParams?.id) ?? "",
  });

  useEffect(() => {
    setCurrentTime(0);
    configMusic();
  }, [currentMusic, currentIndex]);

  useEffect(() => {
    audioRef.current?.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  }, [songParams]);

  useEffect(() => {
    const togglePlayPause = (event: KeyboardEvent) => {
      if (event.code === "Space" && !searching) {
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        event.preventDefault();
        handlePlay();
      }
    };

    document.addEventListener("keydown", togglePlayPause);
    return () => document.removeEventListener("keydown", togglePlayPause);
  }, [isPlaying, searching]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying();
    }
  };

  const handleClick = () => {
    const context = new AudioContext();
    if (context.state === "suspended") {
      context.resume();
    }

    handlePlay();
  };

  useEffect(() => {
    setIsHydrated(true);
    setPlaying(false);

    return () => {
      setIsHydrated(true);
    };
  }, []);

  // const audioSources = useRef(
  //   new Map<HTMLAudioElement, MediaElementAudioSourceNode>()
  // );
  // const audioContext = useRef<AudioContext | null>(null);

  // useEffect(() => {
  //   if (!audioRef.current) return;

  //   // Create a single AudioContext instance
  //   if (!audioContext.current) {
  //     audioContext.current = new AudioContext();
  //   }
  //   const context = audioContext.current;

  //   // Resume context if suspended (important for some browsers like Safari)
  //   if (context.state === "suspended") {
  //     context
  //       .resume()
  //       .catch((error) => console.error("Error resuming AudioContext:", error));
  //   }

  //   // Create a new MediaElementAudioSourceNode if it doesn't exist
  //   let source = audioSources.current.get(audioRef.current);
  //   if (!source) {
  //     source = context.createMediaElementSource(audioRef.current);
  //     audioSources.current.set(audioRef.current, source);
  //   }

  //   // Frequency bands in Hz for Bass, Midrange, and Treble
  //   const bandSplit = [80, 1200, 10000]; // Adjusted for better coverage

  //   // Low frequencies (Bass)
  //   const lBand = context.createBiquadFilter();
  //   lBand.type = "lowshelf";
  //   lBand.frequency.value = bandSplit[0];
  //   lBand.gain.value = 8; // Gentle boost for richer bass

  //   // Mid frequencies (Vocals, instruments)
  //   const mBand = context.createBiquadFilter();
  //   mBand.type = "peaking";
  //   mBand.frequency.value = bandSplit[1];
  //   mBand.gain.value = 6; // Slight boost for clarity
  //   mBand.Q.value = 1.5; // Moderate width for natural sound

  //   // High frequencies (Treble)
  //   const hBand = context.createBiquadFilter();
  //   hBand.type = "highshelf";
  //   hBand.frequency.value = bandSplit[2];
  //   hBand.gain.value = 4; // Subtle lift for brightness

  //   // Connect the audio nodes
  //   source
  //     .connect(lBand)
  //     .connect(mBand)
  //     .connect(hBand)
  //     .connect(context.destination);

  //   // Debugging output to check filter states
  //   console.log("EQ settings applied: ", { lBand, mBand, hBand });

  //   // Cleanup function to release resources
  //   return () => {
  //     if (audioContext.current) {
  //       audioContext.current
  //         .close()
  //         .catch((err) => console.error("Error closing AudioContext:", err));
  //       audioContext.current = null;
  //     }
  //   };
  // }, [audioRef.current]); // Ensure effect runs when audioRef changes

  useEffect(() => {
    // Ajusta el volumen
    if (audioRef.current)
      audioRef.current.volume = Math.min(Math.max(volume, 0), 1);
  }, [volume]);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex flex-row justify-between relative items-center w-full z-50 bg-zinc-900 backdrop-blur-sm bg-opacity-5 py-6 md:lg:pl-8 pl-0 md:lg:gap-2 gap-8 shadow-lg">
      <div className="md:lg:block hidden h-full absolute left-0">
        <CurrentSong
          title={songParams?.title ?? ""}
          artists={songParams?.artist ?? ""}
          image={songParams?.image ?? ""}
          id={songParams?.id?.toString() ?? ""}
        />
      </div>
      <div className="flex w-full h-full justify-center px-8 gap-4 items-center">
        <SongControl
          audioRef={audioRef.current}
          currentTime={currentTime}
          duration={duration}
          setCurrentTime={setCurrentTime}
        />
        <button type="button" onClick={prev}>
          <SkipBack />
        </button>
        <button
          type="button"
          title="Play / Pause"
          name="play-button"
          id="playButton"
          onClick={handleClick}
          className="rounded-full w-10 h-10 flex items-center justify-center p-2 border border-white bg-white"
        >
          {isPlaying ? (
            <Pause strokeWidth={1.5} color="black" fill="black" />
          ) : (
            <Play color="black" fill="black" />
          )}
        </button>
        <button type="button" onClick={next}>
          <SkipForward />
        </button>
        <VolumeControl volume={volume} setVolume={setVolume} />
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={handleFav}>
          <Heart fill={isFav ? "white" : ""} />
        </button>
        <button type="button" onClick={handleOpenModalPlaylist}>
          <ListVideo />
        </button>
      </div>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <audio
        ref={audioRef}
        src={songParams?.url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={next}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
