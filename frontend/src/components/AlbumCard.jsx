import { FavoriteButton } from "./FavoriteButton";
import { useNavigate } from "react-router-dom";
import { AlbumPlayButton } from "./AlbumPlayButton";
import { Navigate } from "react-router-dom";

export const AlbumCard = ({ title, albums }) => {
  const navigate = useNavigate();

  if (!albums || albums.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-10">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-text-primary">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => navigate(`/album/${album.id}`)}
            className="w-full group relative cursor-pointer"
          >
            <div className="relative w-full aspect-square rounded-xl bg-zinc-800 overflow-hidden">
              <img
                src={album.image}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute bottom-1 right-6 flex gap-2 sm:gap-9 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 transition-opacity pointer-events-none sm:pointer-events-auto">
                <FavoriteButton item={album} type="album" />
                <AlbumPlayButton album={album} />
              </div>
            </div>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-text-primary truncate">
              {album.title}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {album.artist}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
