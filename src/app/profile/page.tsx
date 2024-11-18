import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import StatsBlock from "./components/StatsBlock.";
import ModalConfig from "./components/ModalConfig";
export default async function Profile() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-8 items-top relative justify-start h-full p-4">
      <div className="flex w-fit gap-4">
        <Image
          src={session?.user?.image as string}
          alt={session?.user?.name as string}
          width={200}
          height={200}
          draggable={false}
          className=" rounded-md"
        />
        <div className=" ">
          <p className=" text-2xl">{session?.user?.name}</p>
          <p>{session?.user?.email}</p>
        </div>
      </div>
      <ModalConfig session={session} />
      {session ? (
        <>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className=" bg-red-800 px-4 py-2 rounded-lg font-[500]"
            >
              Cerrar session
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/profile/favs"
          className=" bg-red-800 px-4 py-2 rounded-lg font-[500]"
        >
          Cerrar session
        </Link>
      )}
      <StatsBlock session={session} />
    </div>
  );
}
