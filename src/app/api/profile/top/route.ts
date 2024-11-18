import { auth, type session } from "@/auth";

export async function GET(req: Request): Promise<Response> {
  const session: session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const params = url.searchParams;
  const type = params.get("type");

  if (!type) {
    return new Response("Type not found", { status: 400 });
  }

  if (type === "artists" || type === "tracks") {
    const req_spotify = await fetch(
      `https://api.spotify.com/v1/me/top/${type}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const user = await req_spotify.json();

    return Response.json({ data: user });
  }

  return new Response("type needs to be `tracks` or `artists`", {
    status: 400,
  });
}
