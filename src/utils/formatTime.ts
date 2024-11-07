const formatTime = (time: number) => {
  if (time == null) return "0:00";

  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
export const formatTimeWithMilliseconds = (time: number) => {
  if (time == null) return "0:00.000";

  const totalSeconds = Math.floor(time / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default formatTime;
