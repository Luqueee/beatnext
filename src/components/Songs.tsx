"use client";
import { get, search } from "@/lib/soundcloud";
import { useDebounce } from "@/hooks/useDebounce";
import { useMusicStore, type Search } from "@/store/musicStore";
import { MusicIcon } from "./icons";
import Image from "next/image";
import { useRef, useState } from "react";
import download from "downloadjs";

export default function Songs() {
  const { setCurrentMusic, searching, setSearching, setCurrentTime } =
    useMusicStore((state) => state);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [songs, setSongs] = useState<Search[]>([]);
  const fetchSongs = async (input: string) => {
    console.log("fetching songs", input);
    await search(input)
      .then((data) => {
        console.log(data);
        setSongs(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchDebounced = useDebounce(() => {
    fetchSongs(inputRef.current?.value as string);
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

  const fetchSong = async (
    artwork_url: string,
    id: number,
    title: string,
    artist: string
  ) => {
    //console.log(query, API_URL);

    // const data = await getInfo(query);
    // console.log("data", data);
    // setCurrentMusic({
    //   preview_image: data.artwork_url,
    //   id: data.id,
    //   title: data.title,
    //   artist: data.artist ?? data.publisher_metadata.release_title,
    // });
    setCurrentMusic({
      preview_image: artwork_url,
      id: id,
      title: title,
      artist: artist,
    });

    setCurrentTime(0);
  };

  const download_song = (id: number, name: string) => {
    console.log("Downloading", id);
    get(id.toString()).then(async (res) => {
      //console.log(res);

      if (res) {
        // Decode base64 string to binary string
        const binaryString = atob(res);
        // Convert binary string to ArrayBuffer
        const arrayBuffer = new Uint8Array(
          [...binaryString].map((char) => char.charCodeAt(0))
        ).buffer;

        const blob = new Blob([arrayBuffer]);
        console.log("song", blob);
        download(blob, `${name}.mp3`, "audio/mp3");
      } else {
        console.error("Buffer is undefined");
        return;
      }
    });
  };

  return (
    <div className="pt-2">
      <div className=" h-10 mb-4  flex justify-center items-center px-2">
        <input
          type="text"
          value={input}
          ref={inputRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search for a song..."
          onChange={handleInput}
          className="text-black md:lg:w-[40%] w-full rounded-lg pl-2 h-full"
        />
      </div>

      {/* <button onClick={() => fetchSongs(input)}>
        <span>Search</span>
      </button> */}
      <div className="flex flex-col gap-4 ml-2">
        {songs.map(({ title, artist, artwork, id, kind }) => (
          <div
            key={id}
            className="flex md:lg:flex-row flex-col items-center gap-8"
          >
            <Image
              src={artwork}
              alt="album cover"
              width={100}
              height={100}
              unoptimized
              draggable={false}
              className={`${
                kind === "playlist" ? "rounded-md" : "rounded-full"
              }`}
            />
            <div className=" flex gap-8 justify-center items-start my-auto">
              <div className="md:lg:items-start flex-col items-center flex">
                <p className=" w-fit text-center">{title}</p>
                <p className="flex items-center w-fit gap-2">
                  {kind === "track" && <MusicIcon />}
                  <span>{artist}</span>
                </p>
              </div>
            </div>
            <div className=" flex gap-4 h-14">
              {kind === "track" && (
                <>
                  <button
                    type="button"
                    onClick={() => fetchSong(artwork, id, title, artist)}
                    className=" border-2 w-24 border-white rounded-md p-2"
                  >
                    Reproducir
                  </button>
                  <button
                    type="button"
                    onClick={() => download_song(id, title)}
                    className=" border-2 w-24 border-white rounded-md p-2"
                  >
                    Descargar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
