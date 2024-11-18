import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Playlist, Song } from "@/models/playlistSchema";
type favourites = {
  id: number;
  cover: string;
  title: string;
}[];

interface ProfileStoreState {
  favourites: favourites;
  hydrated?: boolean;
  playlists?: Playlist[];
  topTracks?: SpotifyApi.UsersTopTracksResponse[];
  topArtists?: SpotifyApi.UsersTopArtistsResponse[];
  recommendations?: SpotifyApi.RecommendationTrackObject[];
  statsSongs?: SpotifyApi.TrackObjectFull[];
  favouritesProfile?: SpotifyApi.SavedTrackObject[];
}

interface ProfileStoreActions {
  deleteFavourite: (id: number) => void;
  setFavourites: (favourites: favourites) => void;
  setHydrated: () => void;
  addPlaylist: (playlist: Playlist) => void;
  deletePlaylist: (_id: string) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  setAddSongToPlaylist: (song: Song, playlist: Playlist) => void;
  setDeleteSongFromPlaylist: (song: Song, playlist: Playlist) => void;
  getPlaylists: () => Playlist[];
  setTopTracks: (topTracks: SpotifyApi.UsersTopTracksResponse[]) => void;
  setTopArtists: (topArtists: SpotifyApi.UsersTopArtistsResponse[]) => void;
  getTopTracks: () => SpotifyApi.UsersTopTracksResponse[];
  getTopArtists: () => SpotifyApi.UsersTopArtistsResponse[];
  getRecommendations: () => SpotifyApi.RecommendationTrackObject[];
  removeRecomendation: () => void;
  setRecommendations: (
    recommendations: SpotifyApi.RecommendationTrackObject[]
  ) => void;
  setStatsSongs: (statsSongs: SpotifyApi.TrackObjectFull[]) => void;
  getStatsSongs: () => SpotifyApi.TrackObjectFull[];
  setFavoritesProfile: (
    favouritesProfile: SpotifyApi.SavedTrackObject[]
  ) => void;
  getFavoritesProfile: () => SpotifyApi.SavedTrackObject[];
}

export type ProfileStore = ProfileStoreState & ProfileStoreActions;

export const defaultProfileStore: ProfileStoreState = {
  favourites: [],
  hydrated: false,
  playlists: [],
  statsSongs: [],
};

export const useProfileStore = create<
  ProfileStore,
  [["zustand/persist", unknown], ["zustand/immer", never]]
>(
  persist(
    immer<ProfileStore>((set, get) => ({
      ...defaultProfileStore,
      deleteFavourite: (id: number) => {
        set((state) => {
          state.favourites = state.favourites.filter((fav) => fav.id !== id);
        });
      },
      setHydrated: () => {
        set((state) => {
          state.hydrated = true;
        });
      },
      setFavourites: (favourites) => {
        set((state) => {
          state.favourites = favourites;
        });
      },
      addPlaylist: (playlist) => {
        set((state) => {
          state.playlists?.push(playlist);
        });
      },
      deletePlaylist: (_id: string) => {
        set((state) => {
          state.playlists = state.playlists?.filter((p) => p._id !== _id);
        });
      },
      getPlaylists: () => {
        return get().playlists ?? [];
      },
      setPlaylists: (playlists) => {
        set((state) => {
          state.playlists = playlists;
        });
      },
      setAddSongToPlaylist: (song, playlist) => {
        set((state) => {
          const index = state.playlists?.findIndex(
            (p) => p.title === playlist.title
          );
          if (index !== -1) {
            if (state.playlists && index !== undefined && index !== -1) {
              const songExists = state.playlists[index].songs.some(
                (s) => s.id === song.id
              );
              if (!songExists) {
                state.playlists[index].songs.push(song);
              }
            }
          }
        });
      },
      setDeleteSongFromPlaylist: (song, playlist) => {
        set((state) => {
          const index = state.playlists?.findIndex(
            (p) => p.title === playlist.title
          );
          if (index !== -1) {
            if (state.playlists && index !== undefined && index !== -1) {
              state.playlists[index].songs = state.playlists[
                index
              ].songs.filter((s) => s.id !== song.id);
            }
          }
        });
      },
      setTopTracks: (topTracks) => {
        set((state) => {
          state.topTracks = topTracks;
        });
      },
      setTopArtists: (topArtists) => {
        set((state) => {
          state.topArtists = topArtists;
        });
      },
      getTopTracks: () => {
        return get().topTracks ?? [];
      },
      getTopArtists: () => {
        return get().topArtists ?? [];
      },
      getRecommendations: () => {
        return get().recommendations ?? [];
      },
      removeRecomendation: () => {
        set((state) => {
          state.recommendations?.splice(0, 1);
        });
      },
      setRecommendations: (recommendations) => {
        set((state) => {
          state.recommendations = recommendations;
        });
      },
      setStatsSongs: (statsSongs) => {
        set((state) => {
          state.statsSongs = statsSongs;
        });
      },
      getStatsSongs: () => {
        return get().statsSongs ?? [];
      },
      setFavoritesProfile: (favouritesProfile) => {
        set((state) => {
          state.favouritesProfile = favouritesProfile;
        });
      },
      getFavoritesProfile: () => {
        return get().favouritesProfile ?? [];
      },
    })),
    {
      // ...
      name: "profile-store",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);

export default useProfileStore;
