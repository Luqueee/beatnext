import { formatTime } from "@/utils";
import { Slider } from "../ui/slider";

interface SongControlProps {
  audioRef: HTMLAudioElement | null;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
}

const SongControl = ({
  currentTime,
  setCurrentTime,
  audioRef,
  duration,
}: SongControlProps) => {
  return (
    <div className="flex gap-x-3 text-xs md:lg:justify-start justify-center">
      <span className="opacity-50 w-12 text-right">
        {formatTime(currentTime)}
      </span>
      <div className=" absolute -top-2 left-0">
        <Slider
          value={[currentTime]}
          max={duration} //audio?.current?.duration ?? 0
          min={0}
          className="w-screen h-2 py-2"
          onValueChange={(value) => {
            const [newCurrentTime] = value;
            setCurrentTime(newCurrentTime);
            if (audioRef) audioRef.currentTime = newCurrentTime;
          }}
        />
      </div>

      <span className="opacity-50 w-12">{formatTime(duration) ?? "0:00"}</span>
    </div>
  );
};

export default SongControl;
