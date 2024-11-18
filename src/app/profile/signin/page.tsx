"use server";
import { signIn, auth } from "@/auth";
import { Spotify } from "@/components/icons";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();

  if (session) {
    return redirect("/profile");
  }
  return (
    <div className=" flex items-center justify-center h-full">
      <form
        action={async () => {
          "use server";
          await signIn("spotify");
        }}
      >
        <button
          type="submit"
          className=" bg-white text-black font-[500] px-4 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          Iniciar Sesion <Spotify />
        </button>
      </form>
    </div>
  );
}
