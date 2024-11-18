"use client";

import type { session } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spotify } from "@/lib/spotify";
import { useProfileStore } from "@/store";

import { DialogClose } from "@radix-ui/react-dialog";
export default function ModalConfig({ session }: { session: session }) {
  const { setFavoritesProfile } = useProfileStore((state) => state);

  const handleGetFavorites = async () => {
    const favs = await Spotify.getFavsSpotify(session);
    console.log(favs);
    setFavoritesProfile(favs);
  };

  return (
    <div className=" absolute right-4 top-4 text-black px-4 py-2 rounded-lg">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-white">
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Choose you&apos;re prefered settings
            </DialogDescription>
          </DialogHeader>
          <div>
            <Button onClick={handleGetFavorites} variant="default">
              Sinc Spotify Favs
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
