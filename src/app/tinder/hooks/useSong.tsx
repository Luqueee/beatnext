"use client";
import { createRelation, getRelation } from "@/db/songRelation";
import { createSong, getSong } from "@/db/tinder";
import { search } from "@/lib/soundcloud/server";
import { useMusicStore, useSongBarStore } from "@/store";
import { useEffect, useState } from "react";

interface CurrentSong {
  _id: string;
  spotifyId: string;
  soundcloudId: number;
  title: string;
  cover: string;
  artists: string;
  duration: number;
}

const useSong = (
  song: SpotifyApi.RecommendationTrackObject,
  handleIndex: () => void
): {
  currentSong: CurrentSong | undefined;
  likes: number;
  dislikes: number;
} => {
  const [currentSong, setCurrentSong] = useState<CurrentSong>();

  const { generateTracks } = useMusicStore((state) => state);
  const { setPlaying } = useSongBarStore((state) => state);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    //console.log(song);

    const name = song?.name ?? null;
    const id = song?.id ?? null;

    if (!name || !id) return;
    const artists = song?.artists
      ? song?.artists?.map((artist) => artist.name).join(", ")
      : "";
    search(`${name ?? ""} ${artists}`).then((res) => {
      //console.log(`searching for ${name ?? ""} by ${artists}`, res[0], id,song);

      if (!res[0]?.id) handleIndex();

      getRelation({ spotifyId: song.id }).then((relation) => {
        //console.log("relation", relation.res, res);

        if (!relation.res && res[0]?.id) {
          createRelation({
            song: {
              spotifyId: song.id,
              soundcloudId: res[0].id,
              title: song.name,
              cover: song.album.images[0].url,
              artists: artists,
              duration: song.duration_ms,
              popularity: song.popularity,
            },
          }).then(({ res }) => {
            //console.log("created relation", res);
            if (res) {
              setCurrentSong(res);
              PlayTrack(res);
            }
          });
        } else {
          if (relation.res) {
            setCurrentSong(relation.res);
            PlayTrack(relation.res);
          }
        }
      });

      if (res[0]?.id)
        createSong({
          spotifyId: song.id,
          soundcloudId: res[0].id,
          title: song.name,
          cover: song.album.images[0].url,
          artist: artists,
        }).then(() => {
          //console.log("created song", res);
          getSong({ spotifyId: song.id }).then((res) => {
            //console.log("get song", res);
            if (res?.res) {
              setLikes(res.res.likes);
              setDislikes(res.res.dislikes);
            }
          });
        });
    });
  }, [song]);

  const PlayTrack = (song: {
    cover: string;
    soundcloudId: number;
    title: string;
    artists: string;
  }) => {
    generateTracks(
      [
        {
          cover: song?.cover as string,
          id: song?.soundcloudId as number,
          title: song?.title as string,
          artist: song?.artists as string,
        },
      ],
      0,
      "search"
    );
    setPlaying(true);
  };

  return { currentSong, likes, dislikes };
};

export default useSong;
