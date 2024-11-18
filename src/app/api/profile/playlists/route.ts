import { auth } from "@/auth";
import { createPlaylist } from "@/db/playlist";
import { getAllPlaylistsByUsername } from "@/db/playlists";
export async function GET(): Promise<Response> {
  const session = await auth();

  if (!session) {
    return Response.json("Unauthorized", { status: 401 });
  }

  const playlists = await getAllPlaylistsByUsername(
    session?.user?.name as string
  );

  return Response.json({
    data: playlists.res,
  });
}

export async function POST(req: Request): Promise<Response> {
  const session = await auth();

  if (!session) {
    return Response.json("Unauthorized", { status: 401 });
  }

  const { description, title } = await req.json();
  const cover = "https://i1.sndcdn.com/artworks-43dVApaGDkYO-0-large.jpg";

  const res = await createPlaylist({
    username: session?.user?.name ?? "",
    title,
    cover,
    description,
  });

  console.log("res", res);

  return Response.json({ data: res });
}
