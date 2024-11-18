"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { search } from "@/lib/soundcloud/server";
import { useSongBarStore } from "@/store";
import { useCallback, useRef, useState } from "react";
import SearchModal from "./SearchModal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Heart, UserRound, ListVideo, AudioLines } from "lucide-react";
import type { Session } from "next-auth";
import Image from "next/image";
export default function SearchBar({
  isInModal = false,
  session,
  className,
}: {
  isInModal?: boolean;
  session: Session | null;
  className?: string;
}) {
  const { setSearching, setSongResults, searching } = useSongBarStore(
    (state) => state
  );

  //const pathname = usePathname();

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
    // if (pathname !== "/search") {
    //   window.location.href = "/search";
    // }

    setSearching(true);
    setInput(e.target.value);
    console.log(e.target.value, searching);
    handleSearchDebounced();
  };

  const handleInputFocus = () => setSearching(true);

  const handleInputBlur = () => setSearching(false);

  return (
    <div className={"w-fit flex items-center "}>
      <div
        className={`${
          isInModal ? "w-full" : "md:lg:w-[40%] h-12 w-full px-2 md:inline-flex"
        }  ${className} md:lg:absolute left-1/2 transform -translate-x-1/2`}
      >
        <input
          type="text"
          value={input}
          ref={inputRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search for a song..."
          onChange={handleInput}
          className={cn(
            "text-black flex-grow rounded-lg pl-2 z-10 h-full w-full",
            "bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 bg-opacity-50 border border-zinc-800 focus:bg-zinc-800 focus:rounded-sm ",
            "ring-0 outline-none text-white md:lg:block hidden "
          )}
        />
        <div>
          <SearchModal />
        </div>
      </div>
      <div className=" mr-8 inline-flex w-fit h-fit gap-4">
        <Link href="/profile">
          {session?.user?.image ? (
            <Image
              src={session?.user?.image}
              width={42}
              height={42}
              alt="profile image"
              className=" rounded-full cursor-pointer border-2 box-content border-white"
            />
          ) : (
            <UserRound
              size={32}
              className="cursor-pointer"
              color="white"
              strokeWidth={1}
            />
          )}
        </Link>
        <Link
          href="/profile/favs"
          className=" flex items-center justify-center h-[42px] w-[42px]"
        >
          <Heart size={32} className="cursor-pointer" color="white" />
        </Link>
        <Link
          href="/profile/playlists"
          className=" flex items-center justify-center h-[42px] w-[42px]"
        >
          <ListVideo size={32} className="cursor-pointer" color="white" />
        </Link>
        <Link
          href="/tinder"
          className=" flex items-center justify-center h-[42px] w-[42px]"
        >
          <AudioLines size={32} className="cursor-pointer" color="white" />
        </Link>
      </div>
    </div>
  );
}
