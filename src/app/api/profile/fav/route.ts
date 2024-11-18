import { auth } from "@/auth";
import { deleteFav } from "@/db/fav";
export async function DELETE(req: Request): Promise<Response> {
  const { id } = await req.json();

  const session = await auth();

  const res = await deleteFav(id, session?.user?.name as string);

  console.log("res", res);
  return Response.json({
    res: res,
  });
}
