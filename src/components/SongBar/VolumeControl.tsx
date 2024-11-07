import { useRef } from "react";
import { Volume, VolumeSilence } from "../icons";
import { Slider } from "../ui/slider";
import type { MusicStore } from "@/store/musicStore";
import DropdownVolume from "./DropDownVolume";

const VolumeControl = ({
  volume,
  setVolume,
}: {
  volume: MusicStore["volume"];
  setVolume: (volume: number) => void;
}) => {
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

export default VolumeControl;
