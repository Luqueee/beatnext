"use client";
import { Heart } from "lucide-react";
import useProfileStore from "@/store/profileStore";
import Image from "next/image";
import { handleFav } from "../methods";

export type FavSongProps = { id: number; title: string; cover: string };
export default function FavSong({ song, ...params }: { song: FavSongProps }) {
  const { deleteFavourite } = useProfileStore((state) => state);

  const handleChangeFav = () => {
    handleFav(song.id).then((res) => {
      if (res) deleteFavourite(song.id);
    });
  };

  return (
    <div {...params}>
      <div className="flex gap-4 border border-white p-4 rounded-md">
        <Image src={song.cover} alt={song.title} width={80} height={80} />
        <h3>{song.title}</h3>
        <button type="button" onClick={handleChangeFav}>
          <Heart fill="white" />
        </button>
      </div>
    </div>
  );
}
