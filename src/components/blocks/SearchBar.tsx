"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { search } from "@/lib/soundcloud/server";
import { useMusicStore } from "@/store/musicStore";
import { useCallback, useRef, useState } from "react";
import SearchModal from "./SearchModal";
import useWindow from "@/hooks/useWindow";
import { cn } from "@/lib/utils";

export default function SearchBar({
  isInModal = false,
  className,
}: {
  isInModal?: boolean;
  className?: string;
}) {
  const { isDesktop } = useWindow();

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

  const handleInputFocus = () => setSearching(true);

  const handleInputBlur = () => setSearching(false);

  return (
    <div
      className={`${
        isInModal ? "w-full" : "md:lg:w-[40%] h-12 w-full px-2 "
      }  ${className} inline-flex absolute left-1/2 transform -translate-x-1/2`}
    >
      {isDesktop && (
        <input
          type="text"
          value={input}
          ref={inputRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search for a song..."
          onChange={handleInput}
          className={cn(
            "text-black flex-grow rounded-lg pl-2 z-10 ",
            "bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 bg-opacity-50 border border-zinc-800 focus:bg-zinc-800 focus:rounded-sm ",
            "ring-0 outline-none text-white "
          )}
        />
      )}
      <SearchModal />
    </div>
  );
}
