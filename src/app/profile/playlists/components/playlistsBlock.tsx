"use client";
import Image from "next/image";
import { usePlaylists } from "../hooks";
import { ModalFormPlaylist } from "./Modal/ModalFormPlaylist";
import Link from "next/link";
import { useState } from "react";
import { useProfileStore } from "@/store";

export default function PaylistsBlock() {
  const { playlists, deletePlaylist } = usePlaylists();
  const { addPlaylist } = useProfileStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className=" flex flex-col gap-4">
      <ModalFormPlaylist
        handler={addPlaylist}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {playlists.map((playlist) => (
        <div className="flex gap-4" key={playlist._id}>
          <Link
            href={`/profile/playlists/${playlist._id}`}
            className=" flex gap-4 items-center"
          >
            {playlist.cover && (
              <Image
                width={100}
                height={100}
                src={playlist.cover}
                alt={playlist.title}
                className=" rounded-md"
              />
            )}
            <h1>{playlist.title}</h1>
          </Link>
          <button onClick={() => deletePlaylist(playlist._id)} type="button">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
