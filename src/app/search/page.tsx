import { auth } from "@/auth";
import { getFavs } from "@/db/favs";
import SongsResults from "@/components/songResults/SongResults";

export default async function Search() {
  const session = await auth();

  const favs = await getFavs(session?.user?.name as string);

  return <SongsResults session={session} favs={favs.res ?? undefined} />;
}
