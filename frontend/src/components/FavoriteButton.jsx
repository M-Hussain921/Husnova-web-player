import { useContext } from "react";
import { MusicContext } from "../context/MusicContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { AuthModalContext } from "../context/AuthModalContext";

export const FavoriteButton = ({ item, type }) => {
  const {
    likedSongs,
    likedArtists,
    savedAlbums,
    playlists,
    toggleFavorite,
  } = useContext(MusicContext);

  const { token } = useContext(AuthContext);
  const { requireAuth } = useContext(AuthModalContext);

  const getList = () => {
    switch (type) {
      case "song":
        return likedSongs;

      case "artist":
        return likedArtists;

      case "album":
        return savedAlbums;

      case "playlist-song":
        return playlists;

      default:
        return [];
    }
  };

  const list = getList();

  const isFavorite = Array.isArray(list)
    ? list.some((i) => i.id === item.id)
    : false;

  const handleClick = (e) => {
    e.stopPropagation();

    requireAuth(() => {
      toggleFavorite(item, type, token);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="
        w-7 h-7
        min-[648px]:w-8
        min-[648px]:h-8

        flex
        items-center
        justify-center

        rounded-full

        bg-brand-darkest/30
        backdrop-blur-sm

        transition-all
        duration-200

        hover:bg-brand-primary/15
        hover:border-brand-primary/60
        hover:scale-105

        active:scale-95
      "
      aria-label={
        isFavorite
          ? "Remove from favorites"
          : "Add to favorites"
      }
    >
      {isFavorite ? (
        <FaHeart
          className="
            text-sm
            min-[648px]:text-base
            text-brand-primary
          "
        />
      ) : (
        <FaRegHeart
          className="
            text-sm
            min-[648px]:text-base
            text-text-secondary
            hover:text-brand-primary
            transition-colors
          "
        />
      )}
    </button>
  );
};