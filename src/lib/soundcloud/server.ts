"use server";
const client_id = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID;

export async function search(query: string): Promise<SoundCloud.Search[]> {
  const fetch_url = `https://api-v2.soundcloud.com/search?q=${query}&client_id=${client_id}&limit=40&offset=0&app_locale=es`;
  const req_song = await fetch(fetch_url);
  const data = (await req_song.json()) as { collection: SoundCloud.Track[] };
  const songs = data.collection
    .map((song) => {
      return {
        id: song.id,
        title: song.title,
        artist: song?.publisher_metadata?.artist || "Unknown",
        duration: song?.duration || 0,
        artwork: song?.artwork_url || "",
        endpoint: `/song?id=${song.id}`,
        kind: song.kind,
      };
    })
    .filter(
      (song: { title: string; artist: string }) =>
        !song.title?.includes("cover") &&
        !song.title?.includes("Cover") &&
        song.title !== undefined &&
        song.artist !== "Unknown"
    );

  const tracks = songs.filter((song) => song.kind === "track");
  const playlists = songs.filter((song) => song.kind === "playlist");

  const sorted = [...tracks, ...playlists];

  //console.log(songs);
  return sorted;
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
