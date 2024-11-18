import { auth } from "@/auth";
import { getFavs } from "@/db/favs";
export async function GET(): Promise<Response> {
  const session = await auth();

  if (!session) {
    return Response.json("Unauthorized", { status: 401 });
  }

  const favs = await getFavs(session?.user?.name as string);

  return Response.json({
    data: favs.res,
  });
}
