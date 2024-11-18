import Link from "next/link";

interface CurrentSongProps {
  image: string;
  id: string;
  title: string;
  artists: string;
}

const CurrentSong = ({ image, id, title, artists }: CurrentSongProps) => {
  const handleClick = () => {
    window.location.href = `/song/${id}`;
  };
  return (
    <button
      type="button"
      onClick={handleClick}
      className={" flex items-center gap-4 h-full  p-4 "}
    >
      {image ? (
        <picture className="w-16 h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden object-cover">
          <img
            src={image}
            className=" object-cover h-full w-full"
            alt={title}
            decoding="async"
            loading="eager"
          />
        </picture>
      ) : (
        <div className="w-16 h-16 bg-zinc-800 rounded-md shadow-lg overflow-hidden" />
      )}
      <div className="flex items-center">
        <div className="flex flex-col max-w-[25vw] items-start justify-start gap-2 h-full z-50">
          <Link
            href={`/song/${id}`}
            className="font-semibold text-sm block hover:underline text-start transition-all"
          >
            <p className="line-clamp-1">{title}</p>
          </Link>
          <span className="text-xs text-start w-fit opacity-80">{artists}</span>
        </div>
      </div>
    </button>
  );
};

export default CurrentSong;
