"use client";

import * as React from "react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropDown-menu";
import type { Song } from "@/models/playlistSchema";
import useModalPlaylist from "@/hooks/useModalPlaylist";

interface DropDownSongProps {
  handleFavSong: (
    id: number,
    title: string,
    cover: string,
    artist: string
  ) => void;

  isFav: boolean;
  song: Song;
}

export default function DropDownSong({
  handleFavSong,

  isFav,
  song,
}: DropDownSongProps) {
  const { handleOpenModalPlaylist } = useModalPlaylist(song);

  const { id, title, artist, cover } = song;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-24 mr-4 bg-zinc-900 border-transparent">
          {/* <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}

          <DropdownMenuCheckboxItem onClick={handleOpenModalPlaylist}>
            Playlist
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => handleFavSong(id, title, cover, artist)}
            checked={isFav}
          >
            Fav
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
