import { formatTime } from "@/utils";
import { Slider } from "../ui/slider";
import { useEffect } from "react";

interface SongControlProps {
  audio: React.RefObject<HTMLAudioElement>;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

const SongControl = ({
  audio,
  currentTime,
  setCurrentTime,
}: SongControlProps) => {
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
      <div className=" absolute -top-2 left-0">
        <Slider
          value={[currentTime]}
          max={audio?.current?.duration ?? 0}
          min={0}
          className="w-screen h-2 py-2"
          onValueChange={(value) => {
            const [newCurrentTime] = value;
            if (audio.current) audio.current.currentTime = newCurrentTime;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            currentTime;
          }}
        />
      </div>

      <span className="opacity-50 w-12">
        {duration ? formatTime(duration) : "0:00"}
      </span>
    </div>
  );
};

export default SongControl;
