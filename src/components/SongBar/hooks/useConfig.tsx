import { get } from "@/lib/soundcloud/server";
import { stringToBlob } from "@/utils";
import { useMusicStore, useSongBarStore } from "@/store";
import { useCallback, useEffect, useState } from "react";

interface SongParams {
  title: string;
  artist: string;
  image: string;
  url: string;
  id: string;
}

interface UseConfig {
  playerRef: HTMLAudioElement | null;
}

interface UseConfigReturn {
  songParams: SongParams | null;
  isLoaded: boolean;
  duration: number;
  configMusic: () => void;
  startPlayingFromStart: () => void;
  setIsLoaded: (value: boolean) => void;
  setDuration: (value: number) => void;
}

const useConfig = ({ playerRef }: UseConfig): UseConfigReturn => {
  const { setCurrentTime, setPlaying } = useSongBarStore((state) => state);

  const { currentIndex, getTracks } = useMusicStore((state) => state);
  const [songParams, setSongParams] = useState<SongParams | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(0);

  const configMusic = useCallback(async () => {
    const track_list = getTracks();
    const song_data = track_list[currentIndex];
    setCurrentTime(0);

    if (song_data?.id) {
      get(song_data.id.toString()).then(async (res) => {
        try {
          if (res) {
            const blob = stringToBlob(res);
            const url = URL.createObjectURL(blob);
            //console.log("url", url, song_data);

            setSongParams({
              ...songParams,
              title: song_data.title,
              artist: song_data.artist ?? "",
              image: song_data.cover,
              url,
              id: song_data.id.toString(),
            });

            //console.log("songParams", song_data);

            setIsLoaded(true);
          }
        } catch (error) {
          console.error("Error loading audio", error);
        }
      });
    }
  }, [getTracks(), currentIndex]);

  const startPlayingFromStart = useCallback(() => {
    setPlaying(true);
    if (playerRef) {
      playerRef.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    configMusic();
  }, [getTracks()]);

  return {
    songParams,
    isLoaded,
    duration,
    configMusic,
    startPlayingFromStart,
    setIsLoaded,
    setDuration,
  };
};

export default useConfig;
