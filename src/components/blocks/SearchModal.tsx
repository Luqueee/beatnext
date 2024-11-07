"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SearchBar from "./SearchBar";
import SongResults from "../SongResults";
import { useEffect, useState } from "react";
import SearchBarModal from "./SearchBarModal";
import useWindow from "@/hooks/useWindow";
import { Search } from "lucide-react";
export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const { isDesktop } = useWindow();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="h-full absolute right-4 top-0 z-20">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="h-full">
          {isDesktop ? (
            <p className="text-sm text-white h-[70%]">
              <kbd className="pointer-events-none inline-flex px-2 h-full select-none items-center gap-1 rounded border bg-zinc-900 border-zinc-900 bg-muted  font-mono text-[10px] font-medium  opacity-100">
                <span className="text-xs flex">CTRL</span>J
              </kbd>
            </p>
          ) : (
            <Search />
          )}
        </DialogTrigger>

        <DialogContent className="h-[80vh] md:lg:w-[60vw] w-[90%] flex flex-col">
          <SearchBarModal open={open} isInModal={true} className="h-10" />
          <div className=" overflow-y-scroll">
            <SongResults />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
