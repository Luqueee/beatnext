"use server";
import type { Search } from "@/store/musicStore";
const client_id = "6ZQ2Vr6GmERVhpEmkZmcNAuDQ3l9qaZe";

export async function search(query: string): Promise<Search[]> {
  const fetch_url = `https://api-v2.soundcloud.com/search?q=${query}&client_id=${client_id}&limit=20&offset=0&app_locale=es`;
  const req_song = await fetch(fetch_url);
  const data = await req_song.json();
  const songs = data.collection
    .map(
      (song: {
        id: number;
        title: string;
        user: { username: string; avatar_url: string };
        duration: number;
        artwork_url: string;
        kind: "playlist" | "track";
      }) => {
        return {
          id: song.id,
          title: song.title,
          artist: song?.user?.username || "Unknown",
          duration: song?.duration || 0,
          artwork: song?.artwork_url || song?.user?.avatar_url || null,
          endpoint: `/song?id=${song.id}`,
          kind: song.kind,
        };
      }
    )
    .filter(
      (song: { title: string; artist: string }) =>
        !song.title?.includes("cover") &&
        !song.title?.includes("Cover") &&
        song.title !== undefined &&
        song.artist !== "Unknown"
    );

  //console.log(songs);
  return songs;
}

export async function getInfo(id: string): Promise<{
  title: string;
  artist: string;
  id: number;
  artwork_url: string;
}> {
  const fetch_url = `https://api-v2.soundcloud.com/tracks/${id}?client_id=${client_id}`;

  const req_song = await fetch(fetch_url);
  const data = await req_song.json();
  //console.log(data);

  return data;
}

export async function get(id: string): Promise<string | null> {
  console.log("Getting song", id);
  const fetch_url = `https://api-v2.soundcloud.com/tracks/${id}?client_id=${client_id}`;

  const req_song = await fetch(fetch_url);
  const data = await req_song.json();
  //console.log(data);

  console.log(data.media?.transcodings);
  try {
    if (data.media?.transcodings[1]?.format?.protocol === "progressive") {
      const url_buffer = data.media?.transcodings[1]?.url;
      //console.log(url_buffer);
      const m3u_req = await fetch(`${url_buffer}?client_id=${client_id}`);
      const m3u_data = await m3u_req.json();

      const m3uResponse = await fetch(m3u_data.url);
      const buffer = await m3uResponse.arrayBuffer();

      return Buffer.from(buffer).toString("base64");
    }
    const m3u_url = data.media?.transcodings[0]?.url;
    const m3u_req = await fetch(`${m3u_url}?client_id=${client_id}`);
    const m3u_data = await m3u_req.json();

    const m3uResponse = await fetch(m3u_data.url);
    const m3u = (await m3uResponse.text()).split("\n");

    const buffers: Uint8Array[] = [];

    await Promise.all(
      m3u
        .filter((line) => line.includes("https"))
        .map(async (line) => {
          const req = await fetch(line);
          const res = await req.arrayBuffer();
          buffers.push(new Uint8Array(res));
        })
    );

    const arrayBuffer = await new Blob(buffers).arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  } catch (error) {
    console.error(error);
    return null;
  }
}
