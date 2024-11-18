import { getPlaylistById } from "@/db/playlists";
import Image from "next/image";
import SongsPlaylist from "../../../../components/SongsPlaylist";
import BgBlock from "./components/BgBlock";

export default async function Playlist({
  params,
}: {
  params: Promise<{ playlistid: string }>;
}) {
  const playlistid = (await params).playlistid;

  const playlist = (await getPlaylistById(playlistid)).data;

  console.log(playlistid, playlist);

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <BgBlock cover={playlist.cover}>
      <div className=" px-8 flex flex-col gap-4">
        <div className=" grid grid-cols-[auto_1fr] gap-4">
          <Image
            src={playlist?.cover ?? ""}
            alt={playlist.title}
            width={200}
            height={200}
            draggable={false}
            className=" rounded-md"
          />
          <div>
            <h1 className=" text-2xl font-[500]">{playlist.title}</h1>
            <h2>{playlist.username}</h2>
            <h3>{playlist.description}</h3>
          </div>
        </div>
        <div>
          <SongsPlaylist id={playlistid} playlist={playlist} />
        </div>
      </div>
    </BgBlock>
  );
}
