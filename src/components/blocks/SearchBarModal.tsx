"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { search } from "@/lib/soundcloud/server";
import { useMusicStore } from "@/store/musicStore";
import { useCallback, useRef, useState } from "react";

export default function SearchBarModal({
  isInModal = false,
  open,
  className,
}: {
  isInModal?: boolean;
  open: boolean;
  className?: string;
}) {
  const { setSearching, setSongResults, searching } = useMusicStore(
    (state) => state
  );

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchDebounced = useDebounce(() => {
    fetchSongs(inputRef.current?.value as string);
  }, 500);

  const fetchSongs = useCallback(
    async (input: string) => {
      try {
        const data = await search(input);
        setSongResults(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    },
    [setSongResults]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearching(true);
    setInput(e.target.value);
    console.log(e.target.value, searching);
    handleSearchDebounced();
  };

  const handleInputFocus = () => {
    if (open) setSearching(true);
  };

  const handleInputBlur = () => {
    if (open) setSearching(false);
  };

  return (
    <div
      className={` ${
        isInModal ? "w-full" : "md:lg:w-[40%] w-full"
      }  h-full ${className} inline-flex relative`}
    >
      <input
        type="text"
        value={input}
        ref={inputRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Search for a song..."
        onChange={handleInput}
        className={`text-black flex-grow rounded-lg pl-2 z-10`}
      />
    </div>
  );
}
