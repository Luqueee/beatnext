"use client";
import download from "downloadjs";
import { get } from "./server";

export const downloadSong = async (id: number, name: string) => {
  try {
    const res = await get(id.toString());
    if (res) {
      const arrayBuffer = Uint8Array.from(atob(res), (char) =>
        char.charCodeAt(0)
      ).buffer;
      download(new Blob([arrayBuffer]), `${name}.mp3`, "audio/mp3");
    } else {
      console.error("No song data available for download.");
    }
  } catch (err) {
    console.error("Error downloading song:", err);
  }
};
