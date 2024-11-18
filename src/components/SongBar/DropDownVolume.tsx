import { useSongBarStore } from "@/store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropDown-menu";
import { useRef } from "react";
import { Volume, VolumeSilence } from "@/components/icons";
import { Slider } from "@/components/ui/slider";

export default function DropdownVolume() {
  const { volume, setVolume } = useSongBarStore((state) => state);
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button">
          {isVolumeSilenced ? <VolumeSilence /> : <Volume />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex justify-center gap-2 bg-transparent z-[9999999]">
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
          className="w-[95px] py-2 z-[9999999]"
          onValueChange={(value) => {
            const [newVolume] = value;
            const volumeValue = newVolume / 100;
            setVolume(volumeValue);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
