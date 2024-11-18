import { useMusicStore } from "@/store";

const useNext = () => {
  const { currentIndex, setCurrentIndex, getTracks } = useMusicStore(
    (state) => state
  );

  const next = () => {
    const track_list = getTracks();

    const newIndex = currentIndex + 1;
    console.log(
      "next track",
      track_list,
      newIndex,
      track_list.length,
      track_list[newIndex]
    );

    setCurrentIndex(newIndex >= track_list.length ? 0 : newIndex);
  };

  const prev = () => {
    const track_list = getTracks();

    const newIndex = currentIndex - 1;
    console.log(
      "prev track",
      track_list,
      newIndex,
      track_list.length,
      track_list[newIndex]
    );

    setCurrentIndex(newIndex < 0 ? track_list.length - 1 : newIndex);
  };

  return [next, prev];
};

export default useNext;
