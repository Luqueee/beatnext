/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMusicStore } from "@/store/musicStore";
import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import CurrentSong from "./CurrentSong";
import { get } from "@/lib/soundcloud/server";
import VolumeControl from "./VolumeControl";
import SongControl from "./SongControl";

const stringToBlob = (base64: string): Blob => {
  const binaryString = atob(base64);
  const arrayBuffer = Uint8Array.from(binaryString, (char) =>
    char.charCodeAt(0)
  ).buffer;
  return new Blob([arrayBuffer]);
};

export default function SongBar() {
  const {
    isPlaying,
    setIsPlaying,
    setPlaying,
    setPreviousID,
    searching,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    setSearching,
    currentMusic,
    hydrated,
  } = useMusicStore((state) => state);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [titleSong, setTitle] = useState<string>("");
  const [artistSong, setArtist] = useState<string>("");
  const [imageSong, setImage] = useState<string>("");

  const configMusic = useCallback(async () => {
    const song_data = currentMusic;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    if (song_data?.id && audioRef.current) {
      try {
        const res = await get(song_data.id.toString());
        if (res) {
          const blob = stringToBlob(res);
          audioRef.current.src = URL.createObjectURL(blob);
          audioRef.current.currentTime = currentTime;
          audioRef.current.load();
          setPlaying(true);
          setImage(song_data.preview_image);
          setTitle(song_data.title);
          setArtist(song_data.artist);
          if (isPlaying) await audioRef.current.play();
        }
      } catch {
        console.error("Error loading audio");
      }
    }
  }, [currentMusic, volume, currentTime, isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current?.ended) {
        setIsPlaying();
        if (audioRef.current) audioRef.current.currentTime = 0;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    configMusic();
  }, [currentMusic]);

  useEffect(() => {
    const togglePlayPause = (event: KeyboardEvent) => {
      if (event.code === "Space" && !searching) {
        // Verificar si el evento se originó en un input, textarea o elemento con atributo contenteditable
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        event.preventDefault();
        setIsPlaying();
      }
    };

    document.addEventListener("keydown", togglePlayPause);
    return () => document.removeEventListener("keydown", togglePlayPause);
  }, [isPlaying, searching]);

  useEffect(() => {
    const resetPreviousID = () => setPreviousID(0);
    window.addEventListener("beforeunload", resetPreviousID);
    return () => window.removeEventListener("beforeunload", resetPreviousID);
  }, [setPreviousID]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current
        ?.play()
        .catch((error) =>
          console.error("Error playing the audio:", error.message)
        );
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleClick = () => {
    setIsPlaying();
  };

  return (
    <div className="flex flex-row justify-center relative items-center w-full z-50 bg-zinc-900 backdrop-blur-sm bg-opacity-5 py-6 md:lg:pl-8 pl-0 md:lg:gap-2 gap-8 shadow-lg ">
      <div className=" md:lg:block hidden h-full absolute left-0 ">
        <CurrentSong
          title={titleSong ?? ""}
          artists={artistSong ?? ""}
          image={imageSong ?? ""}
          id={currentMusic.id?.toString() ?? ""}
        />
      </div>
      <div className="flex w-full h-full justify-center px-8 items-center">
        {hydrated && (
          <button
            type="button"
            title="Play / Pause"
            name="play-button"
            onClick={handleClick}
            className=" rounded-full w-10 h-10 flex items-center justify-center p-2 border border-white bg-white"
          >
            {isPlaying ? (
              <Pause strokeWidth={1.5} color="black" fill="black" />
            ) : (
              <Play color="black" fill="black" />
            )}
          </button>
        )}
        <SongControl
          audio={audioRef}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
        />
        {hydrated && <VolumeControl volume={volume} setVolume={setVolume} />}
      </div>
      <audio
        ref={audioRef}
        onError={() => console.error("Error loading audio")}
      >
        <track kind="captions" src="captions.vtt" label="English" default />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
