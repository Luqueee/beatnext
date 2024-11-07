import SearchBar from "./blocks/SearchBar";

export default function NavBar() {
  return (
    <div className=" h-full w-full flex items-center justify-between relative gap-2 pt-2 px-2">
      <h1 className=" md:lg:pl-4 pl-0 text-4xl">Beat</h1>
      <SearchBar />
    </div>
  );
}
