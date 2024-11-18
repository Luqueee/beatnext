import PaylistsBlock from "./components/playlistsBlock";
export default async function Profile() {
  return (
    <div className="flex flex-col p-8 gap-8 items-start justify-start h-full">
      <PaylistsBlock />
    </div>
  );
}
