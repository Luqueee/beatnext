"use client";

import type { session } from "@/auth";
import { cache } from "react";

const fetchClient = cache(async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  return res.json();
});

export default class Spotify {
  static async getTopTracks(
    type: "tracks" | "albums",
    session: session
  ): Promise<SpotifyApi.TrackObjectFull[]> {
    const req_spotify = (await fetchClient(
      `https://api.spotify.com/v1/me/top/${type}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    )) as SpotifyApi.UsersTopTracksResponse;

    return req_spotify.items;
  }

  static async searchSpotify(
    query: string,
    session: session
  ): Promise<SpotifyApi.TrackSearchResponse | null> {
    const req_spotify = await fetchClient(
      `https://api.spotify.com/v1/search?q=${query}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return req_spotify;
  }

  static getSpotifyTrackFeatures = async (
    title: string,
    session: session
  ): Promise<SpotifyApi.AudioFeaturesObject | null> => {
    console.log(title, session);
    try {
      const req_search = await Spotify.searchSpotify(title, session);

      if (!req_search) {
        return null;
      }
      const songChoose = req_search.tracks.items[0];

      console.log(songChoose.name);

      const req_feature = await fetchClient(
        `https://api.spotify.com/v1/audio-features/${songChoose.id}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      return req_feature;
    } catch {
      return null;
    }
  };

  static async getRecommendations({
    session,
    genres = ["pop"],
  }: {
    session: session;
    genres?: string[];
  }): Promise<SpotifyApi.RecommendationsObject> {
    const genres_string = genres.join(",");

    const req = await fetchClient(
      `https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_genres=${genres_string}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return req;
  }

  static async getTopItemsUser({
    session,
    type,
  }: {
    session: session;
    type: "tracks" | "artists";
  }): Promise<
    SpotifyApi.UsersTopTracksResponse[] | SpotifyApi.UsersTopArtistsResponse[]
  > {
    const req_spotify = await fetchClient(
      `https://api.spotify.com/v1/me/top/${type}?limit=10`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    console.log(req_spotify);

    return req_spotify.items;
  }

  static async getFavsSpotify(
    session: session
  ): Promise<SpotifyApi.SavedTrackObject[]> {
    const req_spotify = await fetchClient(
      "https://api.spotify.com/v1/me/tracks",
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return req_spotify.items;
  }
}

// const duration = 208240;
// const min_duration = 30000;
// const track_name = req_spotify.items[2].name;
// const artist_name = req_spotify.items[2].artists[0].name;

// const data = await search(`${track_name} - ${artist_name}`);

// const min_diff: {
//   diff: number;
//   data: SoundCloud.Search | null;
// } = {
//   diff: 99999999,
//   data: null,
// };

// const filteredData =
//   data.length > 1
//     ? data.filter((song) => {
//         console.log(song.duration, min_duration);
//         return song.duration > min_duration;
//       })
//     : data;

// console.log({ filteredData }, { data });
// filteredData.map((song) => {
//   if (Math.abs(song.duration - duration) < min_diff.diff) {
//     min_diff.diff = Math.abs(song.duration - duration);
//     min_diff.data = song;
//   }
// });

// console.log({ min_diff });
