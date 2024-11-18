"use server";
import { getInfo } from "@/lib/soundcloud/server";
import Image from "next/image";
import { auth, type session } from "@/auth";
import TrackInfo from "./components/TrackInfo";
export default async function Song({ params }: { params: { songid: string } }) {
  const session: session = await auth();
  const { songid } = params;

  console.log(songid);

  const track = await getInfo(songid);

  return (
    <div className=" p-4">
      <div className=" grid grid-cols-[auto_1fr] gap-4">
        <Image
          src={track.artwork_url}
          alt={track.title}
          width={150}
          height={150}
          draggable={false}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-2xl">{track.title}</h1>
          <p>{track.publisher_metadata.artist}</p>
        </div>
      </div>
      <TrackInfo session={session} track={track} />
    </div>
  );
}
