import { FiPlay, FiPause, FiLoader } from "react-icons/fi";

export const PlayButtonUI = ({ isActive, isLoading, onClick }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`
      w-7 h-7
      min-[648px]:w-10
      min-[648px]:h-10

      flex
      items-center
      justify-center

      rounded-full

      text-white

      bg-brand-primary

      transition-all
      duration-200

      hover:scale-105
      hover:bg-brand-dark

      active:scale-95

      disabled:opacity-60
      disabled:cursor-not-allowed
    `}
  >
    {isLoading ? (
      <FiLoader
        className="
          text-sm
          min-[648px]:text-xl
          animate-spin
        "
      />
    ) : isActive ? (
      <FiPause
        className="
          text-base
          min-[648px]:text-xl
        "
      />
    ) : (
      <FiPlay
        className="
          text-base
          min-[648px]:text-2xl
          ml-[1px]
          min-[648px]:ml-1
        "
      />
    )}
  </button>
);