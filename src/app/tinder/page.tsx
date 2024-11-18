import { auth, type session } from "@/auth";
import TinderBlock from "./components/TinderBlock";

export default async function Tinder() {
  const session: session = await auth();

  return <>{session && <TinderBlock session={session} />}</>;
}
