import Link from "next/link";
import SearchBar from "./blocks/SearchBar";
import { auth } from "@/auth";

export default async function NavBar() {
  const session = await auth();

  return (
    <div className=" h-full w-full flex items-center justify-between relative gap-2 pt-2 px-2">
      <Link href={"/"} className=" md:lg:pl-4 pl-0 text-4xl font-500">
        Beat
      </Link>
      <SearchBar session={session} />
    </div>
  );
}
