/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { search, getInfo, get } from "@/lib/soundcloud";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useMusicStore,
  type MusicStore,
  type Search,
} from "@/store/musicStore";
import Image from "next/image";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export default function Songs() {
  const {
    setIsPlayingBar,
    setCurrentMusic,
    searching,
    setSearching,
    setCurrentTime,
  }: MusicStore = useMusicStore((state) => state);
  const [input, setInput] = useState("despacito");

  const [songs, setSongs] = useState<Search[]>([]);
  const fetchSongs = async (input: string) => {
    // await fetch(`${API_URL}/api/search?q=${input}`, {
    //   method: "GET",
    // })
    await search(input)
      // .then((res) => {
      //   return res.json();
      // })
      .then((data) => {
        console.log(data);
        setSongs(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchDebounced = useDebounce(() => {
    fetchSongs(input);
  }, 500);

  const handleInputFocus = () => {
    if (searching === false) {
      setSearching(true);
    }
  };

  const handleInputBlur = () => {
    if (searching === true) {
      setSearching(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("Searching for:", e.target.value);
    setInput(e.target.value);
    handleSearchDebounced();
  };

  const fetchSong = async (query: string) => {
    console.log(query, API_URL);
    // await fetch(`${API_URL}/api/song?id=${query}`, {
    //   method: "GET",
    // })
    get(query).then(async (res) => {
      console.log(res);

      if (res) {
        // Decode base64 string to binary string
        const binaryString = atob(res);
        // Convert binary string to ArrayBuffer
        const arrayBuffer = new Uint8Array(
          [...binaryString].map((char) => char.charCodeAt(0))
        ).buffer;

        const blob = new Blob([arrayBuffer]);
        console.log("data", blob);
        const data = await getInfo(query);
        setCurrentMusic({
          song: blob as unknown as Blob,
          preview_image: data.artwork_url,
          title: data.title,
          artist: data.artist,
        });

        setIsPlayingBar(true);
        setCurrentTime(0);
      } else {
        console.error("Buffer is undefined");
        return;
      }
    });
  };

  return (
    <div className="">
      <input
        type="text"
        value={input}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Search for a song..."
        onChange={handleInput}
        className="text-black"
      />
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={() => fetchSongs(input)}>
        <span>Search</span>
      </button>
      <div>
        {songs.map(({ title, artist, artwork, id }) => (
          <div key={id}>
            <Image src={artwork} alt="album cover" width={100} height={100} />
            <span>
              {title} - {artist}{" "}
            </span>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={() => fetchSong(id as unknown as string)}>
              Reproducir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
