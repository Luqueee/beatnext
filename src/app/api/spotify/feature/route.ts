import { auth, type session } from "@/auth";

export async function GET(req: Request): Promise<Response> {
  const session: session = await auth();

  const url = new URL(req.url);
  const track = url.searchParams.get("q");
  if (!track) {
    return new Response("ID parameter is missing", { status: 400 });
  }

  const track_result = await fetch(
    `https://api.spotify.com/v1/search?q=${track}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  const res_track = await track_result.json();

  const req_feature = await fetch(
    `https://api.spotify.com/v1/audio-features/${res_track.tracks.items[0].id}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  const res = await req_feature.json();

  return Response.json({
    res: res,
  });
}
