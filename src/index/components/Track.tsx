"use client";
import { search } from "@/lib/soundcloud/server";
import Image from "next/image";
export default function Track({
  track,
  ...props
}: {
  track: SpotifyApi.TrackObjectFull;
}) {
  const handlerClick = () => {
    console.log("track", track);

    const artists = track.artists.map((artist) => artist.name).join(" ");

    search(`${track.name} - ${artists}`).then((res) => {
      console.log("res", res);
      window.location.href = `/song/${res[0].id}`;
    });
  };

  return (
    <button onClick={handlerClick} {...props} className="w-fit p-4">
      <div className="flex gap-2">
        <Image
          src={track.album.images[0].url}
          width={70}
          height={70}
          alt={track.name}
          className="rounded-lg"
        />
        <div className="flex flex-col">
          <h2 className="w-fit text-start">{track.name}</h2>
          <p className="w-fit">{track.artists[0].name}</p>
        </div>
      </div>
    </button>
  );
}
