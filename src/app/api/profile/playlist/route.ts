import { auth } from "@/auth";
import { addSongToPlaylist, deleteSongFromPlaylist } from "@/db/playlist";
export async function POST(req: Request): Promise<Response> {
  const session = await auth();

  if (!session) {
    return Response.json("Unauthorized", { status: 401 });
  }
  const body = await req.json();

  const song = {
    title: body.title,
    cover: body.cover,
    id: body.id,
    artist: body.artist,
  };

  console.log("song", song);

  const response = await addSongToPlaylist({
    username: session?.user?.name ?? "",
    title: body.title_song,
    song,
  });

  return Response.json({
    data: response,
  });
}

export async function DELETE(req: Request): Promise<Response> {
  const session = await auth();

  if (!session) {
    return Response.json("Unauthorized", { status: 401 });
  }

  console.log("DELETE: ", req.url);

  const url = new URL(req.url);
  const title = url.searchParams.get("title");
  const id = url.searchParams.get("id");

  const response = await deleteSongFromPlaylist({
    username: session?.user?.name ?? "",
    title: title as string,
    id: Number(id),
  });

  return Response.json({
    data: response,
  });
}
