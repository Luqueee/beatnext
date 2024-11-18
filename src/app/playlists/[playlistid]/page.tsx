import { getPlaylistById } from "@/db/playlists";
import Image from "next/image";
import SongsPlaylist from "@/components/SongsPlaylist";
export default async function Playlist({
  params,
}: {
  params: { playlistid: string };
}) {
  const { playlistid } = params;

  const playlist = (await getPlaylistById(playlistid)).data;

  console.log(playlist);
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className=" flex gap-4">
        {playlist?.cover && (
          <Image
            src={playlist?.cover}
            alt={playlist?.title}
            width={150}
            height={150}
            className="rounded-lg"
          />
        )}
        <h1 className=" text-2xl">{playlist?.title}</h1>
      </div>
      {playlist && (
        <SongsPlaylist id={playlist._id} profile={false} playlist={playlist} />
      )}
    </div>
  );
}
