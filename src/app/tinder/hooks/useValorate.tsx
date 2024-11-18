import { valorateSong } from "@/db/tinder";

interface CurrentSong {
  _id: string;
  spotifyId: string;
  soundcloudId: number;
  title: string;
  cover: string;
  artists: string;
  duration: number;
}

const useValorate = (
  handleIndex: () => void,
  currentSong: CurrentSong | undefined
): {
  handleLike: () => void;
  handleDislike: () => void;
} => {
  const handleLike = async () => {
    if (currentSong) {
      valorateSong({
        spotifyId: currentSong.spotifyId,
        like: true,
      });

      handleIndex();
    }
  };

  const handleDislike = async () => {
    if (currentSong) {
      valorateSong({
        spotifyId: currentSong.spotifyId,
        like: false,
      });

      handleIndex();
    }
  };

  return { handleLike, handleDislike };
};
export default useValorate;
