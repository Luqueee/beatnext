"use server";

import { auth } from "@/auth";
import FavSongs from "./components/FavSongs";

export default async function Favs() {
  const session = await auth();

  return (
    <div>
      <FavSongs session={session} />
    </div>
  );
}
