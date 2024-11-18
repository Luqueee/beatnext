import { auth } from "@/auth";
import { getPlaylists } from "@/db/playlists";
import TopArtistsUser from "@/index/components/TopArtistsUser";
import TopTracksUser from "@/index/components/TopTracksUser";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const playlists = await getPlaylists();

  return (
    <div className=" p-4 flex flex-col gap-4">
      <h2>Descubre algunas de las playlists de nuestros usuarios</h2>
      <div className=" grid grid-cols-3 gap-2">
        {playlists?.map((playlist) => (
          <Link
            href={`/playlists/${playlist._id}`}
            key={playlist._id}
            className=" flex gap-4 border border-white p-4 rounded-lg"
          >
            <Image
              width={100}
              height={100}
              src={playlist.cover}
              alt={playlist.title}
              className="rounded-lg"
            />
            <div>
              <h2>{playlist.title}</h2>
              <p>{playlist.username}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-2xl">Tus canciones mas escuchadas</p>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
          <TopTracksUser session={session} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-2xl">Tus artistas mas escuchados</p>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-4">
          <TopArtistsUser session={session} />
        </div>
      </div>
      {/* <TopUserBlock session={session} /> */}
    </div>
  );
}
