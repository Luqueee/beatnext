import { auth, type session } from "@/auth";

export async function GET(): Promise<Response> {
  const session: session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const req = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const user = await req.json();
  return Response.json({ data: user });
}
