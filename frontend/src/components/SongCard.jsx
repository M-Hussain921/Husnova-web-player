import { PlayButton } from "./AudioPlayButton";
import { FavoriteButton } from "./FavoriteButton";

export const SongCard = ({ song }) => {
  return (
    <div className="group relative">
      <div className="relative w-full aspect-square rounded-xl  bg-zinc-800 overflow-hidden">
        <img
          src={song.coverArt}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute bottom-1 right-6 flex gap-2 sm:gap-9 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton item={song} type="song" />
          <PlayButton song={song} />
        </div>
      </div>
      <div className="w-full mb-1.5">
        <p className="text-[14px] md:text-base font-semibold text-text-primary truncate">
          {song.title}
        </p>
        <p className="text-xs text-text-secondary truncate">{song.artist}</p>
      </div>
    </div>
  );
};
