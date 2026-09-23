import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthModalContext } from "../context/AuthModalContext";
import { FiPlus } from "react-icons/fi";

export const AddToPlaylistButton = ({ onClick }) => {
  const { token } = useContext(AuthContext);
  const { requireAuth } = useContext(AuthModalContext);

  const handleClick = (e) => {
    e.stopPropagation();

    requireAuth(() => {
      onClick();
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

        text-text-secondary

        transition-all
        duration-200

        hover:bg-brand-primary/15
        hover:border-brand-primary/60
        hover:text-brand-primary
        hover:scale-105

        active:scale-95
      "
      aria-label="Add to playlist"
    >
      <FiPlus
        className="
          text-sm
          min-[648px]:text-base
        "
      />
    </button>
  );
};