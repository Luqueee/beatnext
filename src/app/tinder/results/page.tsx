import { getAllResults } from "@/db/tinder";
import Image from "next/image";

export default async function Results() {
  const results = (await getAllResults()).res;

  console.log("results", results);

  return (
    <div className="p-4">
      <h1>Results</h1>
      <div className="flex flex-col gap-4">
        {results.map((result) => (
          <div key={result._id} className="flex gap-4">
            <Image
              width={100}
              height={100}
              src={result.cover}
              alt={result.title}
              className="rounded-lg"
            />
            <div>
              <h2>{result.title}</h2>
              <h3>{result.artist}</h3>
              <p>Likes: {result.likes}</p>
              <p>Dislikes: {result.dislikes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
