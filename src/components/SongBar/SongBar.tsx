/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useMusicStore } from "@/store/musicStore";
import { useEffect, useRef, useState } from "react";
import DropdownVolume from "./DropDownVolume";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, Volume, VolumeSilence } from "@/components/icons";
import CurrentSong from "./CurrentSong";
import { formatTime } from "@/utils";
import { get } from "@/lib/soundcloud";

interface SongControlProps {
  audio: React.RefObject<HTMLAudioElement>;
}

const SongControl = ({ audio }: SongControlProps) => {
  const { currentTime, setCurrentTime } = useMusicStore((state) => state);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    audio.current?.addEventListener("timeupdate", handleTimeUpdate);

    const interval = setInterval(() => {
      if (audio.current) setCurrentTime(audio.current.currentTime);
    }, 100);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  const handleTimeUpdate = () => {
    if (audio.current) setCurrentTime(audio.current.currentTime);
  };

  const duration = audio?.current?.duration ?? 0;

  return (
    <div className="flex gap-x-3 text-xs md:lg:justify-start justify-center">
      <span className="opacity-50 w-12 text-right">
        {formatTime(currentTime)}
      </span>

      <Slider
        value={[currentTime]}
        max={audio?.current?.duration ?? 0}
        min={0}
        className="md:lg:w-[200px] w-[100px] h-2 py-2"
        onValueChange={(value) => {
          const [newCurrentTime] = value;
          if (audio.current) audio.current.currentTime = newCurrentTime;
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          currentTime;
        }}
      />

      <span className="opacity-50 w-12">
        {duration ? formatTime(duration) : "0:00"}
      </span>
    </div>
  );
};

const VolumeControl = () => {
  const volume = useMusicStore((state) => state.volume);
  const setVolume = useMusicStore((state) => state.setVolume);
  const previousVolumeRef = useRef(volume);
  const isVolumeSilenced = volume < 0.05;

  const handleClickVolumen = () => {
    if (isVolumeSilenced) {
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      setVolume(0);
    }
  };

  return (
    <div className="flex justify-center min-h-full items-center gap-x-2 text-white z-[99999999]">
      <div className="md:lg:flex gap-2 hidden">
        <button
          type="button"
          className="opacity-70 hover:opacity-100 transition"
          name="volume-button"
          onClick={handleClickVolumen}
        >
          {isVolumeSilenced ? <VolumeSilence /> : <Volume />}
        </button>

        <Slider
          defaultValue={[100]}
          max={100}
          min={0}
          value={[volume * 100]}
          className="w-[95px] py-2 "
          onValueChange={(value) => {
            const [newVolume] = value;
            const volumeValue = newVolume / 100;
            setVolume(volumeValue);
          }}
        />
      </div>
      <div className="  md:lg:hidden block">
        <DropdownVolume />
      </div>
    </div>
  );
};

export default function SongBar() {
  const {
    currentMusic,
    setIsPlaying,
    getIsPlaying,
    volume,
    isPlaying,
    previousID,
    currentTime,
    setPreviousID,
    searching,
  } = useMusicStore((state) => state);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [titleSong, setTitle] = useState("");
  const [artistSong, setArtist] = useState("");
  const [imageSong, setImage] = useState("");

  const configMusic = () => {
    const song_data = currentMusic;
    console.log("song_data", song_data);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    try {
      if (song_data) {
        const id_song = song_data.id;

        if (audioRef.current && id_song) {
          get(id_song.toString()).then(async (res) => {
            //console.log(res);

            if (res) {
              // Decode base64 string to binary string
              const binaryString = atob(res);
              // Convert binary string to ArrayBuffer
              const arrayBuffer = new Uint8Array(
                [...binaryString].map((char) => char.charCodeAt(0))
              ).buffer;

              const blob = new Blob([arrayBuffer]);
              console.log("song", blob);

              if (!audioRef.current) return;

              audioRef.current.src = URL.createObjectURL(blob); // Change the source
              audioRef.current.load(); // Load the new source
              audioRef.current.currentTime = currentTime;
              if (isPlaying) {
                try {
                  audioRef.current
                    .play()
                    .catch(() =>
                      console.error("el audio no se pudo reproducir:")
                    );
                } catch {
                  console.error("Error playing the audio");
                }
              }

              setImage(song_data.preview_image);
              setTitle(song_data.title);
              setArtist(song_data.artist);
            } else {
              console.error("Buffer is undefined");
              return;
            }
          });
        }
      }
    } catch {
      //console.error("Error loading audio", error);
      console.error("Error loading audio");
    }
  };

  const handlePlaying = () => {
    if (!isPlaying) {
      audioRef.current?.pause();
    } else {
      if (audioRef.current) {
        audioRef.current
          ?.play()
          .catch((error) =>
            console.error("Error playing the audio:", error.message)
          );
      }
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current?.ended) {
        setIsPlaying(false);
        audioRef.current.currentTime = 0;
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [audioRef]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    configMusic();
  }, [currentMusic]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const togglePlayPause = (event: KeyboardEvent) => {
      if (event.code === "Space" && !searching) {
        event.preventDefault();
        setIsPlaying(!getIsPlaying()); // Toggle `isPlaying`
        //console.log("isPlaying bar", getIsPlaying());
      }
    };

    document.addEventListener("keydown", togglePlayPause);

    return () => {
      document.removeEventListener("keydown", togglePlayPause);
    };
  }, [searching]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.addEventListener("beforeunload", () => setPreviousID(0));
    return () => {
      window.removeEventListener("beforeunload", () => setPreviousID(0));
    };
  }, [previousID]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handlePlaying();
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleClick = () => {
    setIsPlaying(!getIsPlaying());
    console.log("isPlaying", getIsPlaying());
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
        <button
          type="button"
          title="Play / Pause"
          name="play-button"
          onClick={handleClick}
          className="bg-white rounded-full p-2"
        >
          {isPlaying === true ? <Pause /> : <Play />}
        </button>
        <SongControl audio={audioRef} />
        <VolumeControl />
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
