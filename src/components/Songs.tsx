/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useMusicStore } from "@/store/musicStore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export default function Songs() {
  const {
    currentMusic,
    setIsPlaying,
    songLink,
    volume,
    isPlayingBar,
    isPlaying,
    previousID,
    currentTime,
    setSongLink,
    setIsPlayingBar,
    setCurrentMusic,
    setPreviousID,
    searchTerm,
    setSearchTerm,
    searching,
    setSearching,
    setCurrentTime,
  } = useMusicStore((state) => state);
  const [input, setInput] = useState("despacito");

  const [songs, setSongs] = useState([]);
  const fetchSongs = async (input: string) => {
    await fetch(`${API_URL}/api/search?q=${input}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
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
    await fetch(`${API_URL}/api/song?id=${query}`, {
      method: "GET",
    })
      .then((res) => {
        const song = res.arrayBuffer();
        song.then(async (buffer) => {
          const blob = URL.createObjectURL(new Blob([buffer]));

          const info_req = await fetch(`${API_URL}/api/song-info?id=${query}`, {
            method: "GET",
          });
          const data = await info_req.json();
          console.log("data", data, blob);
          setCurrentMusic({
            song: blob,
            preview_image: data.artwork_url,
            title: data.title,
            artist: data.artist,
          });

          setIsPlayingBar(true);
          setCurrentTime(0);
        });
      })

      .catch((err) => {
        console.log(err);
      });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  //   useEffect(() => {
  //     console.log(input);
  //     fetchSongs(input);
  //   }, [debounce]);

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
            <button onClick={() => fetchSong(id)}>Reproducir</button>
          </div>
        ))}
      </div>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      {/* <audio controls ref={audio} /> */}
    </div>
  );
}
