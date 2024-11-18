"use client";

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

import { DialogClose } from "@radix-ui/react-dialog";
import { GenreMultiSelect } from "@/components/ui/multi-select-genre";
export default function ModalConfig({ generate }: { generate: () => void }) {
  return (
    <div className=" absolute right-4 top-4 text-black px-4 py-2 rounded-lg">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-white">
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Choose you&apos;re prefered settings
            </DialogDescription>
          </DialogHeader>
          <GenreMultiSelect />
          <div>
            <Button onClick={generate} variant="default">
              Generate
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
